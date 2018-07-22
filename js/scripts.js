function getRedirects() {
	str = localStorage.getItem('redirects'); 
	return JSON.parse(str);
}

function setRedirects(redirect_list) {
	localStorage.setItem('redirects', JSON.stringify(redirect_list));
	tableUpdate();
}

function clearRedirects() {
	setRedirects([]);
}

function tableUpdate() {
	var redirects = getRedirects();
	var tbody = $('#table_body');
	tbody.html('');
	for (var i=0; i<redirects.length; i++) {
		tableAdd(redirects[i][0], redirects[i][1], i);
	}
	console.log(redirects);
}

function tableAdd(site, redirect, rdrNum) {
	var redirects = getRedirects();
	var table_body = document.getElementById('table_body');
	
	if (table_body) {
		var row = table_body.insertRow();
		var cell_edit = row.insertCell(0);
		var cell_site = row.insertCell(1);
		var cell_arr = row.insertCell(2);
		var cell_rdr = row.insertCell(3);
		var cell_del = row.insertCell(4);
		
		var btn = document.createElement('button');
		btn.type = "button";
		btn.className = "edit";
		btn.id = rdrNum;
		btn.onclick = (editRedirect);
		btn.innerHTML = "&#9998;";
		
		cell_edit.appendChild(btn);
		
		cell_site.innerHTML = site;
		cell_site.id = "site_val";
		cell_arr.innerHTML = "&rarr;";
		cell_arr.id = "rdr_arr";
		cell_rdr.innerHTML = redirect;
		cell_rdr.id = "redirect_val";
		
		var btn = document.createElement('button');
		btn.type = "button";
		btn.className = "remove";
		btn.id = rdrNum;
		btn.onclick = (removeRedirect);
		btn.innerHTML = "&#10005";
		
		cell_del.appendChild(btn);
		
		$(row).find(".remove").on("click", removeRedirect);
	}
}

function addRedirect() {
	var site = document.getElementById('site').value;
	var redirect = document.getElementById('redirect').value;
	var blank_input = /^\s*$/;
	var www_test = /\..*\./;
	var warning_string = /\/.+/;
	var confirmed = true;
	$("#notification").addClass("hidden");
		
	if (site.match(blank_input) || redirect.match(blank_input)) {
		updateNotification("Please enter valid values");
		return;
	}
	
	if (!site.match(www_test) && $("#opt-www").is(":checked")) {
		site = "www." + site;
	}
	
	if (!redirect.match(www_test) && $("#opt-www").is(":checked")) {
		redirect = "www." + redirect;
	}

	if ((site.match(warning_string) || redirect.match(warning_string)) && !$("#opt-warn").is(":checked")) {
		confirmed = confirm("This action will ONLY direct the site entered to the redirect.\n\nAre you sure you want to redirect for these links?\n\nSite: " + site + "\nRedirect: " + redirect);
	}

	if(confirmed) {
		var redirects = getRedirects();
		redirects.push([site, redirect]);
		setRedirects(redirects);
		$("#site").val("");
		$("#redirect").val("");
		
		var add_btn = $("#add");
		add_btn.html("&#10004;");
		add_btn.css("background-color", "#fff");
		add_btn.css("color", "#5487dc");
		setTimeout(function() {
			add_btn.html("Add");
			add_btn.css("background-color", "#5487dc")
			add_btn.css("color", "#fff");
		}, 1100);
	}
}

function updateNotification(message) {
	var notification = $("#notification");
	notification.text(message);
	notification.removeClass("hidden");
}

function removeRedirect() {
	var redirects = getRedirects();
	redirects.splice(this.id, 1);
	setRedirects(redirects);
}

function editRedirect() {
	var site, redirect;
    var currentTd = $(this).parents('tr').find('td').filter(function() {
        return $(this).find('.edit').length === 0 && $(this).find('.remove').length === 0;
    });
    
    if ($(this).html() === String.fromCharCode(9998)) {                  
        $.each(currentTd, function () {
        	$(this).prop('contenteditable', true)
        	$(this).css("color", "#a0a0a0");
        	$(this).css("font-style", "italic");
        });
    } else {
    	$.each(currentTd, function () {
            $(this).prop('contenteditable', false)
            if ($(this).attr("id") === "site_val") {
            	site = $(this).html();
            }
            if ($(this).attr("id") === "redirect_val") {
            	redirect = $(this).html();
            }
        });
    	var redirects = getRedirects();
    	redirects[$(this).attr("id")] = new Array(site, redirect);
    	setRedirects(redirects);
    }

    $(this).html($(this).html() === String.fromCharCode(9998) ? '&#10003;' : '&#9998;')
}

function openOptions(trigger) {
    document.getElementById("options-list").style.height = "100%";
    $("#options-list").removeClass("front");
}

function closeOptions(trigger) {
    document.getElementById("options-list").style.height = "0%";
    $("#options-list").addClass("front");
}

function storePreferences() {
	var checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {},
	$checkboxes = $("#checkbox-container :checkbox");

	$checkboxes.on("change", function(){
		$checkboxes.each(function(){
			checkboxValues[this.id] = this.checked;
		});
		
		localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
	});
	
	$.each(checkboxValues, function(key, value) {
		$("#" + key).prop('checked', value);
	});
}

$(document).ready(function() {
	$("#add").on("click", addRedirect);
	$("#refresh").on("click", tableUpdate);
	$("#clear").on("click", clearRedirects);
	$(".edit").click(editRedirect);
	$("#options").on("click", openOptions);
	$("#closebtn").on("click", closeOptions);
	tableUpdate();
	storePreferences();	
});

