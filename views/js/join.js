const idField = document.getElementById("roomId");

const query = window.location.pathname;

let newQuery = [];
for (let i = 1; i <= query.length; i++) {
  newQuery[i - 1] = query[i];
}

idField.value = newQuery.join("");
