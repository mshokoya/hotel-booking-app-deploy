"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var api_1 = require("../../../lib/api");
var utils_1 = require("../../../lib/utils");
var cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: process.env.NODE_ENV === 'development' ? false : true
};
var logInViaCookie = function (token, db, req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updateRes, viewer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.users.findOneAndUpdate({ _id: req.signedCookies.viewer }, { $set: { token: token } }, { returnOriginal: false })];
            case 1:
                updateRes = _a.sent();
                viewer = updateRes.value;
                if (!viewer) {
                    res.clearCookie('viewer', cookieOptions);
                }
                return [2 /*return*/, viewer];
        }
    });
}); };
var logInViaGoogle = function (code, token, db, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userNamesList, userPhotosList, userEmailsList, userName, userId, userAvatar, userEmail, updateRes, viewer, insertResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Google.logIn(code)];
            case 1:
                user = (_a.sent()).user;
                if (!user) {
                    throw new Error("Google login error");
                }
                userNamesList = user.names && user.names.length ? user.names : null;
                userPhotosList = user.photos && user.photos.length ? user.photos : null;
                userEmailsList = user.emailAddresses && user.emailAddresses.length ? user.emailAddresses : null;
                userName = userNamesList ? userNamesList[0].displayName : null;
                userId = userNamesList && userNamesList[0].metadata && userNamesList[0].metadata.source
                    ? userNamesList[0].metadata.source.id
                    : null;
                userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;
                userEmail = userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;
                if (!userId || !userName || !userAvatar || !userEmail) {
                    throw new Error("Google login error");
                }
                return [4 /*yield*/, db.users.findOneAndUpdate({ _id: userId }, {
                        $set: {
                            name: userName,
                            avatar: userAvatar,
                            contact: userEmail,
                            token: token
                        }
                    }, { returnOriginal: false })];
            case 2:
                updateRes = _a.sent();
                viewer = updateRes.value;
                if (!!viewer) return [3 /*break*/, 4];
                return [4 /*yield*/, db.users.insertOne({
                        _id: userId,
                        token: token,
                        name: userName,
                        avatar: userAvatar,
                        contact: userEmail,
                        income: 0,
                        bookings: [],
                        listings: []
                    })];
            case 3:
                insertResult = _a.sent();
                viewer = insertResult.ops[0];
                _a.label = 4;
            case 4:
                res.cookie('viewer', userId, __assign(__assign({}, cookieOptions), { maxAge: 365 * 24 * 60 * 60 * 1000 }));
                return [2 /*return*/, viewer];
        }
    });
}); };
exports.viewerResolvers = {
    Query: {
        authUrl: function () {
            try {
                return api_1.Google.authUrl;
            }
            catch (error) {
                throw new Error("Failed to query Google Auth Url: " + error);
            }
        }
    },
    Mutation: {
        logIn: function (_root, _a, _b) {
            var input = _a.input;
            var db = _b.db, res = _b.res, req = _b.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var code, token, viewer, _c, error_1;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 5, , 6]);
                            code = input ? input.code : null;
                            token = crypto_1.default.randomBytes(16).toString('hex');
                            if (!code) return [3 /*break*/, 2];
                            return [4 /*yield*/, logInViaGoogle(code, token, db, res)];
                        case 1:
                            _c = _d.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, logInViaCookie(token, db, req, res)];
                        case 3:
                            _c = _d.sent();
                            _d.label = 4;
                        case 4:
                            viewer = _c;
                            if (!viewer) {
                                return [2 /*return*/, { didRequest: true }];
                            }
                            return [2 /*return*/, {
                                    _id: viewer._id,
                                    token: viewer.token,
                                    avatar: viewer.avatar,
                                    walletId: viewer.walletId,
                                    didRequest: true
                                }];
                        case 5:
                            error_1 = _d.sent();
                            throw new Error("Failed to log in: " + error_1);
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        logOut: function (_root, _args, _a) {
            var res = _a.res;
            try {
                res.clearCookie('viewer', cookieOptions);
                return { didRequest: true };
            }
            catch (error) {
                throw new Error("Failed to log out: " + error);
            }
        },
        connectStripe: function (_root, _a, _b) {
            var input = _a.input;
            var db = _b.db, req = _b.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var code, viewer, wallet, updatedRes, error_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            code = input.code;
                            return [4 /*yield*/, utils_1.authorize(db, req)];
                        case 1:
                            viewer = _c.sent();
                            if (!viewer) {
                                throw new Error('viewer cannot be found');
                            }
                            return [4 /*yield*/, api_1.Stripe.connect(code)];
                        case 2:
                            wallet = _c.sent();
                            if (!wallet) {
                                throw new Error('stripe grant error');
                            }
                            return [4 /*yield*/, db.users.findOneAndUpdate({ _id: viewer._id }, { $set: { walletId: wallet.stripe_user_id } }, { returnOriginal: false })];
                        case 3:
                            updatedRes = _c.sent();
                            if (!updatedRes.value) {
                                throw new Error('viewer could not be updated');
                            }
                            viewer = updatedRes.value;
                            return [2 /*return*/, {
                                    _id: viewer._id,
                                    token: viewer.token,
                                    avatar: viewer.avatar,
                                    walletId: viewer.walletId,
                                    didRequest: true
                                }];
                        case 4:
                            error_2 = _c.sent();
                            throw new Error("failed to connect with Stripe " + error_2);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        disconnectStripe: function (_root, _args, _a) {
            var db = _a.db, req = _a.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var viewer, updatedRes, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, utils_1.authorize(db, req)];
                        case 1:
                            viewer = _b.sent();
                            if (!viewer) {
                                throw new Error('viewer cannot be found');
                            }
                            return [4 /*yield*/, db.users.findOneAndUpdate({ _id: viewer._id }, 
                                // it is suppose to be null NOT undefined
                                { $set: { walletId: undefined } }, { returnOriginal: false })];
                        case 2:
                            updatedRes = _b.sent();
                            if (!updatedRes.value) {
                                throw new Error('viewer could not be updated');
                            }
                            viewer = updatedRes.value;
                            return [2 /*return*/, {
                                    _id: viewer._id,
                                    token: viewer.token,
                                    avatar: viewer.avatar,
                                    walletId: viewer.walletId,
                                    didRequest: true
                                }];
                        case 3:
                            error_3 = _b.sent();
                            throw new Error("failed to disconnect with Stripe: " + error_3);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    },
    Viewer: {
        // first arg is root 
        id: function (viewer) { return viewer._id; },
        hasWallet: function (viewer) { return viewer.walletId ? true : undefined; }
    }
};