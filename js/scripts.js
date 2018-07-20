function getRedirects() {
	str = localStorage.getItem("redirects") || "[]";
	return JSON.parse(str);
}

function setRedirects(redirect_list) {
	localStorage.setItem("redirects", JSON.stringify(redirect_list));
	tableUpdate();
}

function clearRedirects() {
	setRedirects([]);
}

function tableUpdate() {
	var redirects = getRedirects();
	var body = $("#table_body");
	body.html('');
	for (var i = 0; i < redirects.length; i++) {
		tableAdd(redirects[i][0], redirects[i][1], i);
	}
}

function tableAdd(site, redirect, rdrNum) {
	var redirects = getRedirects();
	var table_body = document.getElementById("table_body");

	if (table_body) {
		var row = table_body.insertRow();
		var cell_site = row.insertCell(0);
		var cell_rdr = row.insertCell(1);
		var cell_del = row.insertCell(2);

		cell_site.innerHTML = site;
		cell_rdr.innerHTML = redirect;

		var btn = document.createElement('button');
		btn.type = "button";
		btn.className = "remove";
		btn.id = rdrNum;
		btn.onclick = (removeRedirect);
		btn.innerHTML = "&#10005";

		cell_del.appendChild(btn);

		$(row).find('.remove').on('click', removeRedirect);
	}
}

function addRedirect() {
	var site = document.getElementById("site").value;
	var redirect = document.getElementById("redirect").value;

	var redirects = getRedirects();
	redirects.push([site, redirect]);
	setRedirects(redirects);
}

function removeRedirect() {
	var redirects = getRedirects();
	redirects.splice(this.id, 1);
	setRedirects(redirects);
}

$(document).ready(function() {
	$("#add").on("click", addRedirect);
	$("#refresh").on("click", tableUpdate);
	$("#clear").on("click", clearRedirects);
	tableUpdate();
});

