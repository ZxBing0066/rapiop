(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/_guards/can-activate.guard.ts":
/*!***********************************************!*\
  !*** ./src/app/_guards/can-activate.guard.ts ***!
  \***********************************************/
/*! exports provided: CanActivateGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CanActivateGuard", function() { return CanActivateGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/auth/auth.service */ "./src/app/_services/auth/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CanActivateGuard = /** @class */ (function () {
    function CanActivateGuard(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    CanActivateGuard.prototype.canActivate = function (next, state) {
        if (!this.auth.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
        //return this.auth.isLoggedIn()
    };
    CanActivateGuard = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], CanActivateGuard);
    return CanActivateGuard;
}());



/***/ }),

/***/ "./src/app/_model/Item.ts":
/*!********************************!*\
  !*** ./src/app/_model/Item.ts ***!
  \********************************/
/*! exports provided: Item */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Item", function() { return Item; });
var Item = /** @class */ (function () {
    function Item(name, id) {
        this.name = name;
        this.id = id;
    }
    return Item;
}());



/***/ }),

/***/ "./src/app/_services/api.service.ts":
/*!******************************************!*\
  !*** ./src/app/_services/api.service.ts ***!
  \******************************************/
/*! exports provided: ApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiService", function() { return ApiService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _services_items_https_items_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/items/https-items.service */ "./src/app/_services/items/https-items.service.ts");
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/auth/auth.service */ "./src/app/_services/auth/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ApiService = /** @class */ (function () {
    function ApiService(http, auth) {
        this.itemsStrategy = new _services_items_https_items_service__WEBPACK_IMPORTED_MODULE_2__["HttpsItemsService"](http, auth); //MockItemsService
    }
    ApiService.prototype.getCurrentItem = function () {
        return this.itemsStrategy.getCurrentItem();
    };
    ;
    ApiService.prototype.setCurrentItem = function (item) {
        this.itemsStrategy.setCurrentItem(item);
    };
    ;
    ApiService.prototype.getItems = function () {
        return this.itemsStrategy.getItems();
    };
    ;
    ApiService.prototype.removeItem = function (item) {
        return this.itemsStrategy.removeItem(item);
    };
    ;
    ApiService.prototype.addItem = function (item) {
        return this.itemsStrategy.addItem(item);
    };
    ;
    ApiService.prototype.updateItem = function (item) {
        return this.itemsStrategy.updateItem(item);
    };
    ;
    ApiService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]])
    ], ApiService);
    return ApiService;
}());



/***/ }),

/***/ "./src/app/_services/auth/auth.service.ts":
/*!************************************************!*\
  !*** ./src/app/_services/auth/auth.service.ts ***!
  \************************************************/
/*! exports provided: UserSession, AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserSession", function() { return UserSession; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var UserSession = /** @class */ (function () {
    function UserSession() {
    }
    UserSession.prototype.setToken = function (token) {
        this.accessToken = token;
    };
    UserSession.prototype.getToken = function () {
        return this.accessToken;
    };
    UserSession.prototype.destroy = function () {
        this.accessToken = null;
    };
    UserSession = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], UserSession);
    return UserSession;
}());

var AuthService = /** @class */ (function () {
    function AuthService() {
        this.session = new UserSession();
    }
    AuthService.prototype.isLoggedIn = function () {
        return !!this.session.getToken();
    };
    AuthService.prototype.getCurrentSession = function () {
        return this.session;
    };
    AuthService.prototype.logOut = function () {
        if (this.session)
            this.session.destroy();
    };
    AuthService.prototype.signIn = function (accessToken) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if ((!accessToken))
                return;
            _this.session.setToken(accessToken);
            resolve();
        });
    };
    return AuthService;
}());



/***/ }),

/***/ "./src/app/_services/items/abstract-items.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/_services/items/abstract-items.service.ts ***!
  \***********************************************************/
/*! exports provided: AbstractItemsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractItemsService", function() { return AbstractItemsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AbstractItemsService = /** @class */ (function () {
    function AbstractItemsService() {
    }
    AbstractItemsService.prototype.getCurrentItem = function () {
        return this.currentItem;
    };
    ;
    AbstractItemsService.prototype.setCurrentItem = function (item) {
        this.currentItem = item;
    };
    ;
    AbstractItemsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], AbstractItemsService);
    return AbstractItemsService;
}());



/***/ }),

/***/ "./src/app/_services/items/http-items.service.ts":
/*!*******************************************************!*\
  !*** ./src/app/_services/items/http-items.service.ts ***!
  \*******************************************************/
/*! exports provided: HttpItemsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpItemsService", function() { return HttpItemsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _model_Item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../_model/Item */ "./src/app/_model/Item.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _abstract_items_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./abstract-items.service */ "./src/app/_services/items/abstract-items.service.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HttpItemsService = /** @class */ (function (_super) {
    __extends(HttpItemsService, _super);
    function HttpItemsService(http) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.url = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].backendUrl + "/items";
        return _this;
    }
    HttpItemsService.prototype.getItems = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get(_this.url).subscribe(function (response) {
                var items = response.map(function (item) { return new _model_Item__WEBPACK_IMPORTED_MODULE_1__["Item"](item.name, item.id); });
                resolve(items);
            });
        });
    };
    ;
    HttpItemsService.prototype.removeItem = function (item) {
        return this.http.delete(this.url + '/' + item.id).toPromise();
    };
    ;
    HttpItemsService.prototype.addItem = function (item) {
        return this.http.post(this.url, item).toPromise();
    };
    ;
    HttpItemsService.prototype.updateItem = function (item) {
        return this.http.put(this.url + '/' + item.id, item).toPromise();
    };
    HttpItemsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], HttpItemsService);
    return HttpItemsService;
}(_abstract_items_service__WEBPACK_IMPORTED_MODULE_3__["AbstractItemsService"]));



/***/ }),

/***/ "./src/app/_services/items/https-items.service.ts":
/*!********************************************************!*\
  !*** ./src/app/_services/items/https-items.service.ts ***!
  \********************************************************/
/*! exports provided: HttpsItemsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpsItemsService", function() { return HttpsItemsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _http_items_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./http-items.service */ "./src/app/_services/items/http-items.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _model_Item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../_model/Item */ "./src/app/_model/Item.ts");
/* harmony import */ var _auth_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../auth/auth.service */ "./src/app/_services/auth/auth.service.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HttpsItemsService = /** @class */ (function (_super) {
    __extends(HttpsItemsService, _super);
    function HttpsItemsService(http, auth) {
        var _this = _super.call(this, http) || this;
        _this.auth = auth;
        return _this;
    }
    HttpsItemsService.prototype.getHeadersWith = function (token) {
        return {
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        };
    };
    HttpsItemsService.prototype.getCurrentToken = function () {
        return this.auth.getCurrentSession().getToken();
    };
    HttpsItemsService.prototype.getItems = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get(_this.url, _this.getHeadersWith(_this.getCurrentToken())).subscribe(function (response) {
                var items = response.map(function (item) { return new _model_Item__WEBPACK_IMPORTED_MODULE_3__["Item"](item.name, item.id); });
                resolve(items);
            });
        });
    };
    ;
    HttpsItemsService.prototype.removeItem = function (item) {
        return this.http.delete(this.url + '/' + item.id, this.getHeadersWith(this.getCurrentToken())).toPromise();
    };
    ;
    HttpsItemsService.prototype.addItem = function (item) {
        return this.http.post(this.url, item, this.getHeadersWith(this.getCurrentToken())).toPromise();
    };
    ;
    HttpsItemsService.prototype.updateItem = function (item) {
        return this.http.put(this.url + '/' + item.id, item, this.getHeadersWith(this.getCurrentToken())).toPromise();
    };
    HttpsItemsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _auth_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]])
    ], HttpsItemsService);
    return HttpsItemsService;
}(_http_items_service__WEBPACK_IMPORTED_MODULE_1__["HttpItemsService"]));



/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _todolist_todolist_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./todolist/todolist.component */ "./src/app/todolist/todolist.component.ts");
/* harmony import */ var _new_item_new_item_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./new-item/new-item.component */ "./src/app/new-item/new-item.component.ts");
/* harmony import */ var _edit_item_edit_item_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./edit-item/edit-item.component */ "./src/app/edit-item/edit-item.component.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./register/register.component */ "./src/app/register/register.component.ts");
/* harmony import */ var _guards_can_activate_guard__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_guards/can-activate.guard */ "./src/app/_guards/can-activate.guard.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'items', component: _todolist_todolist_component__WEBPACK_IMPORTED_MODULE_3__["TodolistComponent"], canActivate: [_guards_can_activate_guard__WEBPACK_IMPORTED_MODULE_8__["CanActivateGuard"]] },
    { path: 'login', component: _login_login_component__WEBPACK_IMPORTED_MODULE_6__["LoginComponent"] },
    { path: 'register', component: _register_register_component__WEBPACK_IMPORTED_MODULE_7__["RegisterComponent"] },
    { path: 'edit-item', component: _edit_item_edit_item_component__WEBPACK_IMPORTED_MODULE_5__["EditItemComponent"], canActivate: [_guards_can_activate_guard__WEBPACK_IMPORTED_MODULE_8__["CanActivateGuard"]] },
    { path: 'new-item', component: _new_item_new_item_component__WEBPACK_IMPORTED_MODULE_4__["NewItemComponent"], canActivate: [_guards_can_activate_guard__WEBPACK_IMPORTED_MODULE_8__["CanActivateGuard"]] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
            providers: [{ provide: _angular_common__WEBPACK_IMPORTED_MODULE_1__["APP_BASE_HREF"], useValue: '/my/app' }]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\n<div style=\"text-align:center\">\n  <h1>{{ title }}</h1>\n  \n  <div class=\"container\">\n\t<div class=\"col-sm-6 offset-sm-3\">\n  \t\t<router-outlet></router-outlet>\n  \t</div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'To-do list';
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _todolist_todolist_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./todolist/todolist.component */ "./src/app/todolist/todolist.component.ts");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! .//app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _new_item_new_item_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./new-item/new-item.component */ "./src/app/new-item/new-item.component.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./register/register.component */ "./src/app/register/register.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _edit_item_edit_item_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./edit-item/edit-item.component */ "./src/app/edit-item/edit-item.component.ts");
/* harmony import */ var _services_api_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./_services/api.service */ "./src/app/_services/api.service.ts");
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./_services/auth/auth.service */ "./src/app/_services/auth/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _todolist_todolist_component__WEBPACK_IMPORTED_MODULE_4__["TodolistComponent"],
                _new_item_new_item_component__WEBPACK_IMPORTED_MODULE_6__["NewItemComponent"],
                _login_login_component__WEBPACK_IMPORTED_MODULE_7__["LoginComponent"],
                _register_register_component__WEBPACK_IMPORTED_MODULE_8__["RegisterComponent"],
                _edit_item_edit_item_component__WEBPACK_IMPORTED_MODULE_11__["EditItemComponent"]
            ],
            imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_5__["AppRoutingModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ReactiveFormsModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HttpClientModule"]],
            providers: [_services_api_service__WEBPACK_IMPORTED_MODULE_12__["ApiService"], _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_13__["AuthService"], { provide: _angular_common__WEBPACK_IMPORTED_MODULE_2__["APP_BASE_HREF"], useValue: '/angular-todo' }],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/edit-item/edit-item.component.css":
/*!***************************************************!*\
  !*** ./src/app/edit-item/edit-item.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/edit-item/edit-item.component.html":
/*!****************************************************!*\
  !*** ./src/app/edit-item/edit-item.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form (ngSubmit)=\"onSubmit()\" [formGroup]=\"editItemForm\"> \n\n\t<span></span>\n\t\t\t    \n    <div class=\"form-group\">\n        <label for=\"name\">Item name</label>\n        <input type=\"text\" formControlName=\"name\" class=\"form-control\">\n    </div>\n\n    <div class=\"form-group\">\n        <button class=\"btn btn-primary\" type=\"submit\">Save</button>    \n        <a routerLink=\"/items\" class=\"btn btn-link\">Cancel</a>\n    </div>\n\n</form>"

/***/ }),

/***/ "./src/app/edit-item/edit-item.component.ts":
/*!**************************************************!*\
  !*** ./src/app/edit-item/edit-item.component.ts ***!
  \**************************************************/
/*! exports provided: EditItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditItemComponent", function() { return EditItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/api.service */ "./src/app/_services/api.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var EditItemComponent = /** @class */ (function () {
    function EditItemComponent(service, router, formBuilder) {
        this.service = service;
        this.router = router;
        this.formBuilder = formBuilder;
        this.editItemForm = formBuilder.group(this.service.getCurrentItem());
    }
    EditItemComponent.prototype.ngOnInit = function () {
    };
    EditItemComponent.prototype.onSubmit = function () {
        // Do useful stuff with the gathered data
        this.updateItem(this.editItemForm.value);
    };
    EditItemComponent.prototype.updateItem = function (item) {
        var _this = this;
        this.service.updateItem(item)
            .then(function () { _this.router.navigateByUrl('/items'); })
            .catch(function (err) { return console.log(err); });
    };
    EditItemComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-edit-item',
            template: __webpack_require__(/*! ./edit-item.component.html */ "./src/app/edit-item/edit-item.component.html"),
            styles: [__webpack_require__(/*! ./edit-item.component.css */ "./src/app/edit-item/edit-item.component.css")]
        }),
        __metadata("design:paramtypes", [_services_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"]])
    ], EditItemComponent);
    return EditItemComponent;
}());



/***/ }),

/***/ "./src/app/login/login.component.css":
/*!*******************************************!*\
  !*** ./src/app/login/login.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/login/login.component.html":
/*!********************************************!*\
  !*** ./src/app/login/login.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2>Login</h2>\n<form (ngSubmit)=\"login()\" [formGroup]=\"loginForm\"> \n\n    <div class=\"form-group\">\n        <label for=\"username\">Username</label>\n        <input type=\"text\" formControlName=\"username\" class=\"form-control\">\n    </div>\n\n    <div class=\"form-group\">\n        <label for=\"password\">Password</label>\n        <input type=\"password\" formControlName=\"password\" class=\"form-control\"/>\n    </div>\n\n    <div class=\"form-group\">\n        <button class=\"btn btn-primary\">Login</button>    \n        <a routerLink=\"/register\" class=\"btn btn-link\">Register</a>\n    </div>\n\n</form>"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_services/auth/auth.service */ "./src/app/_services/auth/auth.service.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LoginComponent = /** @class */ (function () {
    function LoginComponent(fb, http, auth, router) {
        this.fb = fb;
        this.http = http;
        this.auth = auth;
        this.router = router;
        this.isBusy = false;
        this.hasFailed = false;
        this.url = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].backendUrl + "/Users/login";
        this.loginForm = fb.group({
            username: ['admin', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            password: ['nimda', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
        this.auth.logOut();
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        // Reset status
        this.hasFailed = false;
        var username = this.loginForm.get('username').value;
        var password = this.loginForm.get('password').value;
        return this.http.post(this.url, {
            "username": username,
            "password": password
        }).subscribe(function (response) {
            console.log(response);
            _this.auth.signIn(response["id"]);
            _this.router.navigate(['items']);
        }, function (error) {
            console.log(error);
            _this.hasFailed = true;
        });
    };
    ;
    LoginComponent.prototype.handleError = function () {
        console.log("error");
    };
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/login/login.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/new-item/new-item.component.css":
/*!*************************************************!*\
  !*** ./src/app/new-item/new-item.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/new-item/new-item.component.html":
/*!**************************************************!*\
  !*** ./src/app/new-item/new-item.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form (ngSubmit)=\"onSubmit()\" [formGroup]=\"newItemForm\"> \n\n     <div class=\"form-group\">\n        <label for=\"itemName\">Item name</label>\n        <input type=\"text\" formControlName=\"name\" class=\"form-control\">\n    </div>\n\n    <div class=\"form-group\">\n        <button class=\"btn btn-primary\" type=\"submit\">Save</button>    \n        <a routerLink=\"/items\" class=\"btn btn-link\">Cancel</a>\n    </div>\n\n</form>"

/***/ }),

/***/ "./src/app/new-item/new-item.component.ts":
/*!************************************************!*\
  !*** ./src/app/new-item/new-item.component.ts ***!
  \************************************************/
/*! exports provided: NewItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewItemComponent", function() { return NewItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _model_Item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_model/Item */ "./src/app/_model/Item.ts");
/* harmony import */ var _services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/api.service */ "./src/app/_services/api.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var NewItemComponent = /** @class */ (function () {
    function NewItemComponent(service, router, builder) {
        this.service = service;
        this.router = router;
        this.builder = builder;
        this.newItemForm = builder.group(new _model_Item__WEBPACK_IMPORTED_MODULE_1__["Item"](""));
    }
    NewItemComponent.prototype.ngOnInit = function () {
    };
    NewItemComponent.prototype.onSubmit = function () {
        this.addItem(this.newItemForm.value);
    };
    NewItemComponent.prototype.addItem = function (item) {
        var _this = this;
        this.service.addItem(item)
            .then(function () { console.log("routing"); _this.router.navigateByUrl('/items'); })
            .catch(function (err) { return console.log(err); });
    };
    NewItemComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-new-item',
            template: __webpack_require__(/*! ./new-item.component.html */ "./src/app/new-item/new-item.component.html"),
            styles: [__webpack_require__(/*! ./new-item.component.css */ "./src/app/new-item/new-item.component.css")]
        }),
        __metadata("design:paramtypes", [_services_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]])
    ], NewItemComponent);
    return NewItemComponent;
}());



/***/ }),

/***/ "./src/app/register/register.component.css":
/*!*************************************************!*\
  !*** ./src/app/register/register.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/register/register.component.html":
/*!**************************************************!*\
  !*** ./src/app/register/register.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/register/register.component.ts":
/*!************************************************!*\
  !*** ./src/app/register/register.component.ts ***!
  \************************************************/
/*! exports provided: RegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var RegisterComponent = /** @class */ (function () {
    function RegisterComponent() {
    }
    RegisterComponent.prototype.ngOnInit = function () {
    };
    RegisterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-register',
            template: __webpack_require__(/*! ./register.component.html */ "./src/app/register/register.component.html"),
            styles: [__webpack_require__(/*! ./register.component.css */ "./src/app/register/register.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], RegisterComponent);
    return RegisterComponent;
}());



/***/ }),

/***/ "./src/app/todolist/todolist.component.css":
/*!*************************************************!*\
  !*** ./src/app/todolist/todolist.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".list-group-item span{\n\tmargin-right: 2em;\n}"

/***/ }),

/***/ "./src/app/todolist/todolist.component.html":
/*!**************************************************!*\
  !*** ./src/app/todolist/todolist.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- LIST OF ITEMS -->\n<div class=\"row justify-content-md-center\">\n\t\t<ul class=\"list-group\">\n\t\t\t<li class=\"list-group-item list-group-item-action\" *ngFor=\"let item of items\" >\n\n\t\t\t      <span>{{item.name}}</span>\n\t\t\t      <div class=\"pull-right\">\n\t\t\t          <button class=\"btn btn-primary btn-xs fa fa-pencil\" (click)=\"onEdit(item)\"></button>\n\t\t\t          <button class=\"btn btn-danger btn-xs fa fa-trash-o\" (click)=\"onRemove(item)\"></button>\n\t\t\t      </div>\n\t\t\t</li>\n\n\t\t</ul>\n</div>\n\n<!-- NEW ITEM -->\n<div class=\"row justify-content-md-center\">\n\t\t<nav>\n\t\t\t<a routerLink=\"/new-item\" class=\"pull-right\">New item</a>\n\t\t</nav>\n</div>\n\n"

/***/ }),

/***/ "./src/app/todolist/todolist.component.ts":
/*!************************************************!*\
  !*** ./src/app/todolist/todolist.component.ts ***!
  \************************************************/
/*! exports provided: TodolistComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodolistComponent", function() { return TodolistComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/api.service */ "./src/app/_services/api.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TodolistComponent = /** @class */ (function () {
    function TodolistComponent(service, router) {
        this.service = service;
        this.router = router;
        this.updateLocalItems();
    }
    TodolistComponent.prototype.updateLocalItems = function () {
        var _this = this;
        console.log("Updating items");
        this.service.getItems().then(function (items) { return _this.items = items; });
    };
    TodolistComponent.prototype.ngOnInit = function () { };
    TodolistComponent.prototype.onRemove = function (item) {
        var _this = this;
        this.service.removeItem(item).then(function () { return _this.updateLocalItems(); });
    };
    TodolistComponent.prototype.onEdit = function (item) {
        this.service.setCurrentItem(item);
        this.router.navigateByUrl("/edit-item");
    };
    TodolistComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-todolist',
            template: __webpack_require__(/*! ./todolist.component.html */ "./src/app/todolist/todolist.component.html"),
            styles: [__webpack_require__(/*! ./todolist.component.css */ "./src/app/todolist/todolist.component.css")]
        }),
        __metadata("design:paramtypes", [_services_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], TodolistComponent);
    return TodolistComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    backendUrl: "http://localhost:3000"
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
var module;
window._MY_APP.register('angular-todo', function (mountDOM) {
    var root = document.createElement('app-root');
    mountDOM.appendChild(root);
    Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])()
        .bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
        .then(function (_module) { return (module = _module); })
        .catch(function (err) { return console.log(err); });
}, function (mountDOM) {
    // tslint:disable-next-line:no-unused-expression
    module && module.destroy();
    mountDOM.innerHTML = null;
});


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/ZxBing0066/Workspace/work/devopsframe/rapiop/todo-list-with-angular-6/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map