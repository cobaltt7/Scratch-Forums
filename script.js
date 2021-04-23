function forumPosterRanks(threads) {
	posts = [];
	usernames = [];
	counts = [];
	reps = [0, 0, 0, 0];
	i = [1, 1, 1, 1];
	j = 0;
	final = [];
	returnVal = {};
	threads.forEach((num, index) => {
		fetch("https://scratchdb.lefty.one/v2/forum/search/?q=%2Btopic:" + num + "&o=oldest")
			.then((response) => response.text())
			.then((html) => {
				reps[index] = Math.floor(JSON.parse(html).hits / 50) + 1;
				posts = posts.concat(JSON.parse(html).posts);
				j++;
				for (i[index] = 1; i[index] < reps[index]; i[index]++) {
					fetch(
						"https://scratchdb.lefty.one/v2/forum/search/?q=%2Btopic:" + num + "&o=oldest&page=" + i[index],
					)
						.then((response) => response.text())
						.then((html) => {
							posts = posts.concat(JSON.parse(html).posts);
							j++;
							if (reps.reduce((a, b) => a + b) == j) {
								posts.forEach((_, i) => {
									usernames.push(posts[i].username);
								});
								usernames.forEach((username) => {
									if (counts[username] == undefined) {
										counts[username] = 1;
									} else {
										++counts[username];
									}
								});
								for (var key in counts) {
									final.push([key, counts[key]]);
								}

								final.sort(function (a, b) {
									a = a[1];
									b = b[1];
									return a < b ? -1 : a > b ? 1 : 0;
								});
								final.reverse();
								document.getElementById("load").outerHTML = "";
								for (var l = 0; l < final.length; l++) {
									e = document.createElement("tr");
									e.innerHTML =
										"<td>" +
										(l + 1) +
										"</td><td>" +
										final[l][0] +
										"</td><td>" +
										final[l][1] +
										"</td>";
									document.getElementById("table").appendChild(e);
								}
							}
						});
				}
			});
	});
	//PP forumPosterRanks(["382664", "454707", "406057", "386916"])
	//TIPS forumPosterRanks(["353324", "383762", "353432", "348733", "313844"])
	//TES forumPosterRanks(["324409", "200055", "400433", "340393", "316229", "338436", "392579"])
}

function addInput() {
	e = document.createElement("input");
	e.setAttribute("type", "text");
	e.setAttribute("name", "thread");
	document.getElementById("threads").insertBefore(e, document.getElementById("brAdd"));
}
