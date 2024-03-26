// pulled this from somewhere online
const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
};

function keydown(search, event) {
	if (event.keyCode == 13) {
		let closest_book_i = undefined;
		let closest_chapter_i = undefined;
		let closest_dist = undefined;

		for (let book_i = 0; book_i < BOOKS.length; book_i++) {
			let book = BOOKS[book_i];
			let book_name = BOOK_NAMES[book_i];
			for (let chapter_i = 0; chapter_i < book.length; chapter_i++) {
				let s = book_name + " " + (chapter_i + 1);
				let dist = levenshteinDistance(s, search);
				console.log(s + "dist: " + dist);
				if (closest_dist === undefined || dist < closest_dist) {
					closest_dist = dist;
					closest_book_i = book_i;
					closest_chapter_i = chapter_i;
				}
			}
			
			let dist = levenshteinDistance(book_name, search);
			if (closest_dist === undefined || dist < closest_dist) {
				closest_dist = dist;
				closest_book_i = book_i;
				closest_chapter_i = 0;
			}
		}

		const params = new URLSearchParams(window.location.search);
		params.set("search", BOOK_NAMES[closest_book_i] + " " + (closest_chapter_i + 1));
		window.location.href = window.location.href.split('?')[0] + "?" + params;
	}
}

function not_found() {
	const verses = document.getElementById("verses");
	verses.innerHTML = "<h2>(NOT FOUND)</h2>";
}

function found(book_i, chapter_i) {
	const verses = document.getElementById("verses");
	html = "";
	for (let i = 0; i < BOOKS[book_i][chapter_i].length; i++) {
		html += "<div>";
		html += "<span>";
		html += i + 1;
		html += "</span>";
		html += "<p>";
		html += BOOKS[book_i][chapter_i][i];
		html += "</p>";
		html += "</div>";
	}

	verses.innerHTML = html;
}

class SearchParser {
  constructor(line) {
		this.line
  }

	parse() {

	}
}

let current_book_i = undefined;
let current_chapter_i = undefined;

document.addEventListener("DOMContentLoaded", function(event) {
	const params = new URLSearchParams(window.location.search);
	const search = document.getElementById("search");
	if (params.has("search")) {
		search.value = params.get("search");

		let closest_book_i = undefined;
		let closest_chapter_i = undefined;
		let closest_dist = undefined;

		for (let book_i = 0; book_i < BOOKS.length; book_i++) {
			let book = BOOKS[book_i];
			let book_name = BOOK_NAMES[book_i];
			for (let chapter_i = 0; chapter_i < book.length; chapter_i++) {
				let s = book_name + " " + (chapter_i + 1);
				let dist = levenshteinDistance(s, search.value);
				console.log(s + "dist: " + dist);
				if (closest_dist === undefined || dist < closest_dist) {
					closest_dist = dist;
					closest_book_i = book_i;
					closest_chapter_i = chapter_i;
				}
			}
			
			let dist = levenshteinDistance(book_name, search);
			if (closest_dist === undefined || dist < closest_dist) {
				closest_dist = dist;
				closest_book_i = book_i;
				closest_chapter_i = 0;
			}
		}

		current_book_i = closest_book_i;
		current_chapter_i = closest_chapter_i;

		found(closest_book_i, closest_chapter_i);
	} else {
		current_book_i = 0;
		current_chapter_i = 0;
		found(0, 0);
	}

	console.log(current_book_i);
	console.log(current_chapter_i);
});

function prev() {
	const params = new URLSearchParams(window.location.search);
	const prev_chapter_i = current_chapter_i - 1;
	if (prev_chapter_i < 0) {
		const prev_book_i = current_book_i - 1;
		if (prev_book_i < 0) {
			return;
		}

		params.set("search", BOOK_NAMES[prev_book_i] + " " + BOOKS[prev_book_i].length);
		window.location.href = window.location.href.split('?')[0] + "?" + params;
	} else {
		params.set("search", BOOK_NAMES[current_book_i] + " " + current_chapter_i);
		window.location.href = window.location.href.split('?')[0] + "?" + params;
	}
}

function next() {
	const params = new URLSearchParams(window.location.search);
	const next_chapter_i = current_chapter_i + 1;
	if (next_chapter_i >= BOOKS[current_book_i].length) {
		if (current_book_i + 1 >= BOOKS.length) {
			return;
		}

		params.set("search", BOOK_NAMES[current_book_i + 1] + " 1");
		window.location.href = window.location.href.split('?')[0] + "?" + params;
	} else {
		params.set("search", BOOK_NAMES[current_book_i] + " " + (next_chapter_i + 1));
		window.location.href = window.location.href.split('?')[0] + "?" + params;
	}
}