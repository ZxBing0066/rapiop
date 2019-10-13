const template = `
<nav class="navbar navbar-default" role="navigation">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="/jquery-spa-example/#home">jQuery SPA</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse navbar-ex1-collapse">
        <ul class="nav navbar-nav">
            <li><a href="/jquery-spa-example/#about">About</a></li>
            <li><a href="/jquery-spa-example/#contact">Contact</a></li>
        </ul>
    </div>
    <!-- /.navbar-collapse -->
</nav>

<div id="page-container"></div>

<script id="home-page-template" type="text/x-handlebars-template">
<div id="home-page" class="page active">
    <p>
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    </p>
</div>
</script>

<script id="about-page-template" type="text/x-handlebars-template">
<div id="about-page" class="page">
    <p>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </p>
</div>
</script>

<script id="contact-page-template" type="text/x-handlebars-template">
<div id="contact-page" class="page">
    <p>
    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
    </p>
</div>
</script>
`;

window._MY_APP.register(
    'jquery-spa-example',
    mountDOM => {
        mountDOM.innerHTML = template;

        // Location polyfill for ie, ff < 21.0 and safari
        if (typeof window.location.origin === 'undefined') {
            window.location.origin = window.location.protocol + '//' + window.location.host;
        }

        // Utility (helper) functions
        var utils = {
            // Finds a handlebars template by id.
            // Populates it with the passed in data
            // Appends the generated html to div#order-page-container
            renderPageTemplate: function(templateId, data) {
                var _data = data || {};
                var templateScript = $(templateId).html();
                var template = Handlebars.compile(templateScript);

                // Empty the container and append new content
                $('#page-container').empty();

                // Empty the container and append new content
                $('#page-container').append(template(_data));
            },

            // If a hash can not be found in routes
            // then this function gets called to show the 404 error page
            pageNotFoundError: function() {
                var data = {
                    errorMessage: '404 - Page Not Found'
                };
                this.renderPageTemplate('#error-page-template', data);
            },

            // Fetch json data from the given url
            // @return promise
            fetch: function(url, data) {
                var _data = data || {};
                return $.ajax({
                    context: this,
                    url: window.location.origin + '/' + url,
                    data: _data,
                    method: 'GET',
                    dataType: 'JSON'
                });
            }
        };

        /**
         *  Router - Handles routing and rendering for the order pages
         *
         *  Summary:
         *      - url hash changes
         *      - render function checks routes for the hash changes
         *      - function for that hash gets called and loads page content
         */
        var router = {
            // An object of all the routes
            routes: {},
            init: function() {
                console.log('router was created...');
                this.bindEvents();

                // Manually trigger a hashchange to start the router.
                // This make the render function look for the route called "" (empty string)
                // and call it"s function
                $(window).trigger('hashchange');
            },
            bindEvents: function() {
                // Event handler that calls the render function on every hashchange.
                // The render function will look up the route and call the function
                // that is mapped to the route name in the route map.
                // .bind(this) changes the scope of the function to the
                // current object rather than the element the event is bound to.
                $(window).on('hashchange', this.render.bind(this));
            },
            // Checks the current url hash tag
            // and calls the function with that name
            // in the routes
            render: function() {
                // Get the keyword from the url.
                var keyName = window.location.hash.split('/')[0];

                // Grab anything after the hash
                var url = window.location.hash;

                // Hide whatever page is currently shown.
                $('#page-container')
                    .find('.active')
                    .hide()
                    .removeClass('active');

                // Call the the function
                // by key name
                if (this.routes[keyName]) {
                    this.routes[keyName](url);

                    // Render the error page if the
                    // keyword is not found in routes.
                } else {
                    utils.pageNotFoundError();
                }
            }
        };

        var spaRoutes = {
            // Default route (home page)
            '#home': function(url) {
                console.log('home was called...');
                utils.renderPageTemplate('#home-page-template');
            },
            '#about': function(url) {
                console.log('about was called...');
                utils.renderPageTemplate('#about-page-template');
            },
            '#contact': function(url) {
                console.log('contact was called...');
                utils.renderPageTemplate('#contact-page-template');
            }
        };

        // Create a new instance of the router
        var spaRouter = $.extend({}, router, {
            routes: spaRoutes
        });

        spaRouter.init();
        window.location.hash = '#home';
    },
    mountDOM => {
        console.log('unmount jquery');

        mountDOM.innerHTML = null;
    }
);
