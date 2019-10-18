const template = `
        <section id="todoapp">
			<header id="header">
				<h1>todos</h1>
				<input id="new-todo" placeholder="What needs to be done?" autofocus>
			</header>
			<section id="main">
				<input id="toggle-all" type="checkbox">
				<label for="toggle-all">Mark all as complete</label>
				<ul id="todo-list"></ul>
			</section>
			<footer id="footer"></footer>
		</section>
		<footer id="info">
			<p>Double-click to edit a todo</p>
			<p>Written by <a href="https://github.com/tastejs">The TodoMVC team</a></p>
			<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
		</footer>
		<script type="text/template" id="item-template">
			<div class="view">
				<input class="toggle" type="checkbox" <%= completed ? 'checked' : '' %>>
				<label><%- title %></label>
				<button class="destroy"></button>
			</div>
			<input class="edit" value="<%- title %>">
		</script>
		<script type="text/template" id="stats-template">
			<span id="todo-count"><strong><%= remaining %></strong> <%= remaining === 1 ? 'item' : 'items' %> left</span>
			<ul id="filters">
				<li>
					<a class="selected" href="#/">All</a>
				</li>
				<li>
					<a href="#/active">Active</a>
				</li>
				<li>
					<a href="#/completed">Completed</a>
				</li>
			</ul>
			<% if (completed) { %>
			<button id="clear-completed">Clear completed (<%= completed %>)</button>
			<% } %>
		</script>
`;

window._MY_APP.register(
    'todomvc-backbone-es6',
    mountDOM => {
        mountDOM.innerHTML = template;
        window.System.import('js/app');
    },
    mountDOM => {
        mountDOM.innerHTML = null;
    }
);
