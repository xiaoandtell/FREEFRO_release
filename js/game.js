/**
 * BEFORE OBSERVING OR ACQUIRING SOURCE CODE,
 * YOU MUST FULLY READ, UNDERSTAND, AND AGREE TO COMPLY STRICTLY
 * WITH LICENSE.txt, AND SEND YOUR AGREEMENT TO XJ.
 * https://github.com/xiaoandtell/FREEFRO_release/blob/master/LICENSE.txt
 */

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Game
// Game Classes
// Game Constants
// Game Type
var XG;
(function (XG) {
    // **** game starting point ****
    window.onload = function () {
        var gm = new Gm(1280, 720, Phaser.AUTO);
        gm.transparent = true;
        gm.state.add(Ks.game, GmStPlay);
        gm.state.start(Ks.game);
    };
    /** game */
    var Gm = /** @class */ (function (_super) {
        __extends(Gm, _super);
        function Gm() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._onBallGrabbed = new Phaser.Signal();
            _this._onGravitySpike = new Phaser.Signal();
            _this._onInputDown = new Phaser.Signal();
            _this._onPreRender = new Phaser.Signal();
            _this._onUpdate = new Phaser.Signal();
            return _this;
        }
        Object.defineProperty(Gm, "ie", {
            /** game instance */
            get: function () {
                return Phaser.GAMES[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gm.prototype, "b2d", {
            get: function () {
                return this.physics.box2d;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gm.prototype, "onBallGrabbed", {
            // signals:
            get: function () { return this._onBallGrabbed; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gm.prototype, "onGravitySpike", {
            get: function () { return this._onGravitySpike; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gm.prototype, "onInputDown", {
            get: function () { return this._onInputDown; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gm.prototype, "onPreRender", {
            // signals: steps
            get: function () { return this._onPreRender; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gm.prototype, "onUpdate", {
            get: function () { return this._onUpdate; },
            enumerable: true,
            configurable: true
        });
        Gm.isDebugging = false; // true; //
        return Gm;
    }(Phaser.Game));
    XG.Gm = Gm;
    /** playing game state */
    var GmStPlay = /** @class */ (function (_super) {
        __extends(GmStPlay, _super);
        function GmStPlay() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GmStPlay.prototype.init = function () {
            this.initGame();
            this.initLoad();
        };
        GmStPlay.prototype.initGame = function () {
            // fill page with game
            this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            // for accurate fps
            this.game.time.advancedTiming = true;
        };
        GmStPlay.prototype.initLoad = function () {
            var gm = this.game;
            var textLoad = gm.add.text(0, 0, 'LOADING.', { fill: Color.toStringHex(Color.WHITE) });
            gm.load.onLoadComplete.addOnce(textLoad.destroy, textLoad);
        };
        GmStPlay.prototype.preload = function () {
            this.preloadAudio();
            this.preloadFonts();
            this.preloadGraphics();
        };
        GmStPlay.prototype.preloadAudio = function () {
            var dir = 'assets/audio/';
            var ks = [
                Ks.afroHit, Ks.tierBonusBronze, Ks.tierBonusSilver,
                Ks.tierBonusGold, Ks.tierBonusTyrian, Ks.tierBonusBling,
                Ks.attractBall, Ks.ballBounce, Ks.ballHit, Ks.bruh,
                Ks.fenceHit, Ks.footStep, Ks.gameOn, Ks.gameOver,
                Ks.gravitySpike, Ks.none, Ks.score, Ks.timeTick, Ks.timeTock
            ];
            var extMp3 = '.mp3', extOgg = '.ogg'; // for Firefox browser
            for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
                var k = ks_1[_i];
                var pathK = dir + k;
                this.game.load.audio(k, [pathK + extMp3, pathK + extOgg]);
            }
        };
        GmStPlay.prototype.preloadFonts = function () {
            var dir = 'assets/fonts/';
            var ks = [Ks.font0, Ks.font1];
            for (var _i = 0, ks_2 = ks; _i < ks_2.length; _i++) {
                var k = ks_2[_i];
                var pathK = dir + k;
                this.game.load.bitmapFont(k, pathK + '.png', pathK + '.fnt');
            }
        };
        GmStPlay.prototype.preloadGraphics = function () {
            var dir = 'assets/graphics/'; //_collision
            var ks = [
                Ks.ballFC, Ks.ballGS, Ks.ballWM,
                Ks.bg, Ks.cloud, Ks.ground, Ks.hoop,
                Ks.mcChest, Ks.mcFemur, Ks.mcFoot, Ks.mcGut, Ks.mcHand,
                Ks.mcHead, Ks.mcHeadBronze, Ks.mcHeadSilver,
                Ks.mcHeadGold, Ks.mcHeadTyrian, Ks.mcHeadBling,
                Ks.mcHip, Ks.mcHumerus, Ks.mcTibia, Ks.mcUlna
            ];
            for (var _i = 0, ks_3 = ks; _i < ks_3.length; _i++) {
                var k = ks_3[_i];
                this.game.load.image(k, dir + k + '.png');
            }
        };
        GmStPlay.prototype.create = function () {
            this.createBox2D();
            this.createManagers();
        };
        GmStPlay.prototype.createBox2D = function () {
            var physics = this.game.physics;
            physics.startSystem(Phaser.Physics.BOX2D);
            var gmB2D = physics.box2d;
            gmB2D.debugDraw.joints = true;
            gmB2D.setPTMRatio(GmPhysics.B2D_PTM);
            gmB2D.gravity.y = GmPhysics.B2D_GRAVITY;
            gmB2D.world.SetContactListener(new GmContactListener());
            // debugging
            gmB2D.debugDraw.joints = true;
            box2d.DEBUG = true;
            box2d.ENABLE_ASSERTS = true;
        };
        GmStPlay.prototype.createManagers = function () {
            XG.MrCookie.init();
            XG.MrVsGm.init();
            XG.MrSettings.init();
            XG.MrTierBonus.init();
            XG.MrSound.init();
            XG.MrStage.init();
            XG.MrInput.init();
        };
        GmStPlay.prototype.preRender = function () {
            this.game.onPreRender.dispatch();
        };
        GmStPlay.prototype.render = function () {
            if (Gm.isDebugging) {
                this.game.debug.box2dWorld();
            }
        };
        GmStPlay.prototype.update = function () {
            this.game.onUpdate.dispatch();
        };
        return GmStPlay;
    }(Phaser.State));
    XG.GmStPlay = GmStPlay;
    var GmContactListener = /** @class */ (function (_super) {
        __extends(GmContactListener, _super);
        function GmContactListener() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GmContactListener.prototype.BeginContact = function (contact) {
            this.contact(contact, Ks.handleBeginContact);
        };
        GmContactListener.prototype.EndContact = function (contact) {
            this.contact(contact, Ks.handleEndContact);
        };
        GmContactListener.prototype.PreSolve = function (contact, _oldManifold) {
            this.contact(contact, Ks.handlePreSolve /*, _oldManifold*/);
        };
        GmContactListener.prototype.contact = function (contact, kFunction) {
            var fA = contact.GetFixtureA(), eA = fA.GetUserData();
            var fB = contact.GetFixtureB(), eB = fB.GetUserData();
            if (eA && eA[kFunction]) {
                eA[kFunction](fA, fB, contact);
            }
            if (eB && eB[kFunction]) {
                eB[kFunction](fB, fA, contact);
            }
        };
        return GmContactListener;
    }(box2d.b2ContactListener));
    XG.GmContactListener = GmContactListener;
    /** game physics */
    var GmPhysics = /** @class */ (function (_super) {
        __extends(GmPhysics, _super);
        function GmPhysics() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // enables physics on graphics without fixtures
        GmPhysics.enable = function (obj) {
            Gm.ie.b2d.enable(obj, false);
            obj.body.clearFixtures();
            return obj.body;
        };
        // disables contacts for fixtures intended to be weights
        GmPhysics.disableContactsFixture = function (f) {
            f.SetSensor(true);
            f.GetFilterData().categoryBits = Collision.NONE;
            f.GetFilterData().maskBits = Collision.NONE;
        };
        GmPhysics.B2D_PTM = 100;
        GmPhysics.B2D_GRAVITY = 200;
        GmPhysics.GRAVITYSCALE_x1 = 1;
        GmPhysics.GRAVITYSCALE_DROP = 4;
        GmPhysics.MIN_MASS = 0.001;
        return GmPhysics;
    }(Phaser.Physics));
    XG.GmPhysics = GmPhysics;
    /** game helper functions */
    var GmH = /** @class */ (function () {
        function GmH() {
        }
        GmH.count = function (vs) {
            return Object.keys(vs).length;
        };
        GmH.getKs = function (obj) { return Object.keys(obj); };
        GmH.isUndefined = function (v) {
            return typeof v === 'undefined';
        };
        /**
         * transforms an implicitly even-length array into a K2V Object
         *
         * even-indexed elements become keys, odd-indexed elements become values
         */
        GmH.toK2VFromK0V1s = function () {
            var pairsK0V1 = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                pairsK0V1[_i] = arguments[_i];
            }
            var result = {};
            for (var iKV = 0; iKV < pairsK0V1.length; iKV += 2) {
                var k = pairsK0V1[iKV], v = pairsK0V1[iKV + 1];
                result[k] = v;
            }
            return result;
        };
        return GmH;
    }());
    XG.GmH = GmH;
    /**
     * generic component class to handle functional specifics of larger classes
     */
    var A_ = /** @class */ (function () {
        function A_(entity) {
            this.entity = entity;
            this.constructThis();
        }
        return A_;
    }());
    XG.A_ = A_;
    var Graphic = /** @class */ (function (_super) {
        __extends(Graphic, _super);
        function Graphic() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Graphic;
    }(Phaser.Graphics));
    XG.Graphic = Graphic;
    var GSprite = /** @class */ (function (_super) {
        __extends(GSprite, _super);
        function GSprite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GSprite;
    }(Phaser.Sprite));
    XG.GSprite = GSprite;
    /** collision constants */
    var Collision = /** @class */ (function () {
        function Collision() {
        }
        Collision.NONE = 0x0000;
        Collision.GROUND = 0x0001;
        Collision.FENCE = 0x0002;
        Collision.HOOP = 0x0004;
        Collision.BALL = 0x0008;
        Collision.MC = 0x0010;
        Collision.MC_TORSO = 0x0020;
        Collision.MC_LIMB = 0x0040;
        Collision.MC_HAND = 0x0080;
        Collision.MC_SHOULDER = 0x0100;
        Collision.BOUNDARY = Collision.GROUND | Collision.FENCE;
        return Collision;
    }());
    XG.Collision = Collision;
    /** color constants */
    var Color = /** @class */ (function () {
        function Color() {
        }
        Color.toStringHex = function (c) {
            return '#' + c.toString(16).substring(0, 6);
        };
        Color.BALL_FC = 0xff9933;
        Color.BALL_GS = 0xcc00cc;
        Color.BALL_WM_GREEN = 0x009900;
        Color.BALL_WM_RED = 0xcc0000;
        Color.BLACK = 0x000000;
        Color.BRONZE = 0x993300;
        Color.BRONZE_DARK = 0x663300;
        Color.CYAN = 0x00ffff;
        Color.GREEN = 0x00ff00;
        Color.GRAY_DARK = 0x333333;
        Color.GRAY_MID = 0x999999;
        Color.MC_SKIN = 0x8c6239;
        Color.ORANGE = 0xff9900;
        Color.PINK = 0xff9999;
        Color.RED = 0xff0000;
        Color.TYRIAN = 0x993399;
        Color.TYRIAN_DARK = 0x660033;
        Color.WHITE = 0xffffff;
        Color.YELLOW = 0xffff00;
        return Color;
    }());
    XG.Color = Color;
    /** miscellaneous constants */
    var Consts = /** @class */ (function () {
        function Consts() {
        }
        Consts.E = 2.71828182846;
        Consts.PHI = 1.61803398875;
        return Consts;
    }());
    XG.Consts = Consts;
    /** keys or keyword constants */
    var Ks = /** @class */ (function () {
        function Ks() {
        }
        Ks.afroHit = 'afroHit';
        Ks.attractBall = 'attractBall';
        Ks.ballGS = 'ballGS';
        Ks.ballFC = 'ballFC';
        Ks.ballWM = 'ballWM';
        Ks.ball_throwUnready = 'ball_throwUnready';
        Ks.ball_throwReady = 'ball_throwReady';
        Ks.ball_release = 'ball_release';
        Ks.ballArrow = 'ballArrow';
        Ks.ballBounce = 'ballBounce';
        Ks.ballHit = 'ballHit';
        Ks.bg = 'bg';
        Ks.bruh = 'bruh';
        Ks.cloud = 'cloud';
        Ks.fenceHit = 'fenceHit';
        Ks.font0 = 'ToBeContinued';
        Ks.font1 = 'DAMAGED';
        Ks.footStep = 'footStep';
        Ks.fAfro = 'fAfro';
        Ks.fHand = 'fHand';
        Ks.fFoot = 'fFoot';
        Ks.fLomoStep = 'fLomoStep';
        Ks.game = 'game';
        Ks.gameOn = 'gameOn';
        Ks.gameOver = 'gameOver';
        Ks.gravitySpike = 'gravitySpike';
        Ks.ground = 'ground';
        Ks.handleBeginContact = 'handleBeginContact';
        Ks.handleEndContact = 'handleEndContact';
        Ks.handlePreSolve = 'handlePreSolve';
        Ks.hiScore = 'hiScore';
        Ks.hiTier = 'hiTier';
        Ks.hoop = 'hoop';
        Ks.input = 'input';
        Ks.instructions = 'instructions';
        Ks.jump_ready = 'jump_ready';
        Ks.jump_started = 'jump_started';
        Ks.jump_stopped = 'jump_stopped';
        Ks.k = 'k';
        Ks.mcChest = 'mcChest';
        Ks.mcFemur = 'mcFemur';
        Ks.mcFoot = 'mcFoot';
        Ks.mcGut = 'mcGut';
        Ks.mcHand = 'mcHand';
        Ks.mcHead = 'mcHead';
        Ks.mcHeadBronze = 'mcHeadBronze';
        Ks.mcHeadSilver = 'mcHeadSilver';
        Ks.mcHeadGold = 'mcHeadGold';
        Ks.mcHeadTyrian = 'mcHeadTyrian';
        Ks.mcHeadBling = 'mcHeadBling';
        Ks.mcHip = 'mcHip';
        Ks.mcHumerus = 'mcHumerus';
        Ks.mcTibia = 'mcTibia';
        Ks.mcUlna = 'mcUlna';
        Ks.none = 'none';
        Ks.particle = 'particle';
        Ks.score = 'score';
        Ks.sound = 'sound';
        Ks.tierBonusBronze = 'tierBonusBronze';
        Ks.tierBonusSilver = 'tierBonusSilver';
        Ks.tierBonusGold = 'tierBonusGold';
        Ks.tierBonusTyrian = 'tierBonusTyrian';
        Ks.tierBonusBling = 'tierBonusBling';
        Ks.timeTick = 'timeTick';
        Ks.timeTock = 'timeTock';
        return Ks;
    }());
    XG.Ks = Ks;
    var Text = /** @class */ (function () {
        function Text() {
        }
        Object.defineProperty(Text, "NOUN_INPUT", {
            get: function () {
                return (XG.DetectDevice.isMobileOrTablet)
                    ? 'TOUCH FINGER'
                    : 'CURSOR';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text, "VERB_INPUT", {
            get: function () {
                return (XG.DetectDevice.isMobileOrTablet)
                    ? 'TAP'
                    : 'CLICK';
            },
            enumerable: true,
            configurable: true
        });
        return Text;
    }());
    XG.Text = Text;
})(XG || (XG = {}));
// Ball
/// <reference path="./G.ts" />
var XG;
(function (XG) {
    var Ball = /** @class */ (function () {
        function Ball(x, y, k) {
            this.gravityScale_x1 = XG.GmPhysics.GRAVITYSCALE_x1;
            this.gravityScale_drop = XG.GmPhysics.GRAVITYSCALE_DROP;
            /** primary color */
            this.color = XG.Color.WHITE;
            this.timeBonus = XG.MrSettings.SECONDS_PER_SCORE;
            this._onBeginContact = new Phaser.Signal();
            this._onEndContact = new Phaser.Signal();
            this._onForce = new Phaser.Signal();
            this._onHoldChange = new Phaser.Signal();
            this._onScore = new Phaser.Signal();
            this.k = k;
            this.isTouchable = true;
            this.constructBall(x, y);
            this.constructComponents();
            this.constructlistenSignals();
        }
        Object.defineProperty(Ball.prototype, "isHeld", {
            get: function () { return !this.isTouchable; },
            set: function (v) {
                var g = this.g, b = g.body;
                if (v) {
                    this.isTouchable = false;
                    this.onHoldChange.dispatch(true);
                    XG.MrStage.ie.groupMCMiddle.add(g);
                    // prevent ball from weighing hands down
                    b.mass = XG.GmPhysics.MIN_MASS;
                }
                else {
                    this.onHoldChange.dispatch(false);
                    XG.MrStage.ie.groupBall.add(g);
                    // ball remains untouchable to prevent sticking to hand
                    XG.Gm.ie.time.events.add(1000, this.isHeldSetBallTouchable, this);
                    b.mass = this.mass_x1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Ball.prototype.isHeldSetBallTouchable = function () {
            this.isTouchable = true;
        };
        Object.defineProperty(Ball.prototype, "isOffscreen", {
            get: function () { return this.g.body.y < -Ball.DIAMETER; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "onBeginContact", {
            // signals
            get: function () { return this._onBeginContact; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "onEndContact", {
            get: function () { return this._onEndContact; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "onForce", {
            get: function () { return this._onForce; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "onHoldChange", {
            /** dispatch(isInHands: boolean) */
            get: function () { return this._onHoldChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "onScore", {
            get: function () { return this._onScore; },
            enumerable: true,
            configurable: true
        });
        Ball.prototype.constructBall = function (x, y) {
            var k = this.k, group = XG.MrStage.ie.groupBall;
            var g = XG.Gm.ie.add.sprite(x, y, k, null, group);
            this.g = g;
            var b = XG.GmPhysics.enable(g);
            var f = b.setCircle(Ball.DIAMETER / 2);
            f.SetUserData(this);
            b.bullet = true;
            b.restitution = 1 - 1 / XG.Consts.PHI;
            b.setCollisionCategory(XG.Collision.BALL);
            b.setCollisionMask(XG.Collision.BALL | XG.Collision.BOUNDARY
                | XG.Collision.HOOP | XG.Collision.MC_TORSO | XG.Collision.MC_HAND);
            // set default mass
            this.mass_x1 = b.mass;
        };
        Ball.prototype.constructComponents = function () {
            switch (this.k) {
                case XG.Ks.ballFC:
                    this.componentK = new Ball_KFC(this);
                    break;
                case XG.Ks.ballGS:
                    this.componentK = new Ball_KGS(this);
                    break;
                case XG.Ks.ballWM:
                    this.componentK = new Ball_KWM(this);
                    break;
            }
            // componentK first sets ball's primary color,
            // arrow next uses ball's primary color
            this.arrow = new Ball_Arrow(this);
        };
        Ball.prototype.constructlistenSignals = function () {
            XG.Gm.ie.onGravitySpike.add(this.handleGravitySpike, this);
            XG.Gm.ie.onUpdate.add(this.update, this);
        };
        Ball.prototype.handleGravitySpike = function () {
            this.g.body.velocity.y += 500;
        };
        //
        Ball.prototype.handleBeginContact = function (fThis, fThat) {
            this.onBeginContact.dispatch(fThis, fThat);
            var categThat = fThat.GetFilterData().categoryBits;
            if (categThat & XG.Collision.GROUND) {
                XG.Gm.ie.sound.play(XG.Ks.ballBounce);
            }
            else if (categThat & XG.Collision.HOOP && !fThat.IsSensor()) {
                XG.Gm.ie.sound.play(XG.Ks.ballHit);
            }
        };
        Ball.prototype.handlePreSolve = function (fThis, fThat, c) {
            // do not contact MC if being held or just thrown
            if (this.isTouchable) {
                return;
            }
            var categThat = fThat.GetFilterData().categoryBits;
            var isCollidingThat =
            // held ball should collide with front shoulder
            ((categThat & XG.Collision.MC_SHOULDER) == 0) &&
                // held ball should pass through MC's body and other balls
                ((categThat & (XG.Collision.MC | XG.Collision.BALL)) != 0);
            if (isCollidingThat) {
                c.SetEnabled(false);
            }
        };
        Ball.prototype.handleEndContact = function (fThis, fThat) {
            this.onEndContact.dispatch(fThis, fThat);
            if (fThat.IsSensor()) {
                return;
            }
            var categThat = fThat.GetFilterData().categoryBits;
            if ((categThat & XG.Collision.HOOP) != 0) {
                // ball bouncing off top off hoop's rim forces MC to release
                if (this.g.body.y < XG.Hoop.Y) {
                    this.onForce.dispatch();
                }
            }
        };
        Ball.prototype.update = function () {
            var b = this.g.body;
            b.gravityScale = (b.velocity.y > 0)
                ? this.gravityScale_drop
                : this.gravityScale_x1;
        };
        Ball.DIAMETER = 64;
        return Ball;
    }());
    XG.Ball = Ball;
    var Ball_Arrow = /** @class */ (function (_super) {
        __extends(Ball_Arrow, _super);
        function Ball_Arrow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Ball_Arrow.prototype, "tint", {
            set: function (v) { this.gArrow.tint = this.gPlus.tint = v; },
            enumerable: true,
            configurable: true
        });
        Ball_Arrow.prototype.constructThis = function () {
            this.constructThisGraphicArrow();
            this.constructThisGraphicPlus();
            this.constructThisListenSignals();
            this.tint = this.entity.color;
        };
        Ball_Arrow.prototype.constructThisGraphicArrow = function () {
            var ht = 2, // thickness / 2
            hw = 16, yT = 8, yB = 20;
            var g = XG.Gm.ie.add.graphics(0, 0, XG.MrStage.ie.groupBall);
            g.beginFill(XG.Color.WHITE);
            g.lineStyle(2, XG.Color.BLACK, 0.75);
            g.drawPolygon(0, yT - ht, // top
            -hw - ht, yB, -hw + ht, yB + ht, // left
            0, yT + ht, // inner top
            hw - ht, yB + ht, hw + ht, yB // right
            );
            this.gArrow = g;
        };
        Ball_Arrow.prototype.constructThisGraphicPlus = function () {
            var ht = 2, // thickness / 2
            hd = 8; // dimension / 2 == width / 2 == height / 2
            var g = XG.Gm.ie.add.graphics(0, 0, XG.MrStage.ie.groupBall);
            g.beginFill(XG.Color.WHITE);
            g.lineStyle(2, XG.Color.BLACK, 0.75);
            // top -> center
            g.moveTo(ht, -hd);
            g.lineTo(-ht, -hd);
            g.lineTo(-ht, -ht);
            // left -> center
            g.lineTo(-hd, -ht);
            g.lineTo(-hd, ht);
            g.lineTo(-ht, ht);
            // bottom -> center
            g.lineTo(-ht, hd);
            g.lineTo(ht, hd);
            g.lineTo(ht, ht);
            // right -> center
            g.lineTo(hd, ht);
            g.lineTo(hd, -ht);
            g.lineTo(ht, -ht);
            g.alpha = 0;
            this.gPlus = g;
        };
        Ball_Arrow.prototype.constructThisListenSignals = function () {
            XG.Gm.ie.onUpdate.add(this.update, this);
            XG.Gm.ie.onGravitySpike.add(this.handleGravitySpike, this);
        };
        Ball_Arrow.prototype.handleGravitySpike = function () {
            // plus sign to indicate drop speed increase
            var gPlus = this.gPlus;
            gPlus.alpha = 1;
            var propertiesTw = { alpha: 0 };
            var tw = XG.Gm.ie.add.tween(gPlus);
            tw.to(propertiesTw, 250, Phaser.Easing.Quadratic.In);
            tw.start();
        };
        Ball_Arrow.prototype.update = function () {
            var gArrow = this.gArrow, gPlus = this.gPlus;
            if (!this.entity.isOffscreen) {
                // hide arrow and plus sign when ball is on screen,
                // as these only exist to indicate offscreen ball's x
                gArrow.y = gPlus.y = -100;
                return;
            }
            var gBall = this.entity.g;
            gArrow.scale.x = Math.min(1, 500 / (-Ball.DIAMETER - gBall.y));
            gArrow.x = gPlus.x = gBall.x;
            gArrow.y = 0;
            gPlus.y = 32;
        };
        return Ball_Arrow;
    }(XG.A_));
    XG.Ball_Arrow = Ball_Arrow;
    /**
     * unique fried chicken ball properties:
     * less friction, increasing game time bonus
     */
    var Ball_KFC = /** @class */ (function (_super) {
        __extends(Ball_KFC, _super);
        function Ball_KFC() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // game time bonus increases periodically by Fibonacci sequence
            // (skip 1, 1,) 2, 3, 5, 8, 13, 21, ...
            // so player may gamble ball-in-air time to extend game time
            /** game time bonus in seconds when scoring */
            _this.timeBonusPrev = 1;
            return _this;
        }
        Object.defineProperty(Ball_KFC.prototype, "isTimeBonusActive", {
            get: function () {
                return this.eventTimeBonus != null && XG.MrVsGm.ie.isStarted;
            },
            enumerable: true,
            configurable: true
        });
        Ball_KFC.prototype.constructThis = function () {
            this.constructThisProperties();
            this.constructThisGraphicEffect();
            this.constructThisListenSignals();
        };
        Ball_KFC.prototype.constructThisProperties = function () {
            this.entity.color = XG.Color.BALL_FC;
            // less friction
            this.entity.g.body.friction /= 2;
        };
        Ball_KFC.prototype.constructThisGraphicEffect = function () {
            var g = XG.Gm.ie.add.graphics(0, 0);
            g.lineStyle(16, XG.Color.BALL_FC, 0.5);
            g.beginFill(XG.Color.WHITE);
            g.drawCircle(0, 0, Ball.DIAMETER + 16);
            g.alpha = 0;
            this.entity.g.addChild(g);
            this.gEffectTimeBonus = g;
        };
        Ball_KFC.prototype.constructThisListenSignals = function () {
            var ball = this.entity;
            ball.onBeginContact.add(this.handleBeginContact, this);
            ball.onHoldChange.add(this.handleHoldChange, this);
            ball.onScore.add(this.clearTimeBonus, this);
        };
        Ball_KFC.prototype.handleBeginContact = function (_fThis, fThat) {
            if (this.entity.isHeld || fThat.IsSensor()) {
                return;
            }
            var categThat = fThat.GetFilterData().categoryBits;
            if ((categThat & XG.Collision.GROUND) == 0) {
                return;
            }
            this.clearTimeBonus();
        };
        Ball_KFC.prototype.handleHoldChange = function (isInHands) {
            this.clearTimeBonus();
            if (isInHands) {
                return;
            }
            this.eventTimeBonus = XG.Gm.ie.time.events.add(Ball_KFC.DELAY_TIME_BONUS, this.activateTimeBonus, this);
        };
        Ball_KFC.prototype.activateTimeBonus = function () {
            this.incrementTimeBonus();
            this.updateEffectTimeBonus();
        };
        Ball_KFC.prototype.incrementTimeBonus = function () {
            var ball = this.entity;
            // update time bonus to next number in Fibonacci sequence
            var timeBonusPrev = ball.timeBonus;
            ball.timeBonus += this.timeBonusPrev;
            this.timeBonusPrev = timeBonusPrev;
            this.eventTimeBonus = XG.Gm.ie.time.events.add(Ball_KFC.DELAY_TIME_BONUS, this.incrementTimeBonus, this);
        };
        Ball_KFC.prototype.clearTimeBonus = function () {
            if (!this.isTimeBonusActive) {
                return;
            }
            XG.Gm.ie.time.events.remove(this.eventTimeBonus);
            this.eventTimeBonus = null;
            this.timeBonusPrev = 1;
            this.entity.timeBonus = XG.MrSettings.SECONDS_PER_SCORE;
            // complete time bonus effect
        };
        Ball_KFC.prototype.updateEffectTimeBonus = function () {
            var gm = XG.Gm.ie;
            var isActive = this.isTimeBonusActive;
            var ball = this.entity;
            var gEffect = this.gEffectTimeBonus;
            var isBlinkingOn = isActive && gEffect.alpha == 0;
            if (isBlinkingOn) {
                gEffect.alpha = Math.min(1, this.entity.timeBonus / 21);
                ball.arrow.tint = XG.Color.WHITE;
                gm.sound.play(XG.Ks.timeTick);
            }
            else {
                gEffect.alpha = 0;
                ball.arrow.tint = ball.color;
                gm.sound.play(XG.Ks.timeTock);
            }
            if (!isActive) {
                return;
            }
            var delayBlink = 1000 / Math.min(21, this.entity.timeBonus);
            gm.time.events.add(delayBlink, this.updateEffectTimeBonus, this);
        };
        Ball_KFC.DELAY_TIME_BONUS = XG.Consts.E * 1000;
        return Ball_KFC;
    }(XG.A_));
    XG.Ball_KFC = Ball_KFC;
    /**
     * unique grape soda ball properties:
     * slower drop, erratic bounce
     */
    var Ball_KGS = /** @class */ (function (_super) {
        __extends(Ball_KGS, _super);
        function Ball_KGS() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Ball_KGS.prototype.constructThis = function () {
            this.constructThisProperties();
            this.constructThisListenSignals();
        };
        Ball_KGS.prototype.constructThisProperties = function () {
            this.entity.color = XG.Color.BALL_GS;
            // slower drop
            this.entity.gravityScale_drop /= 2;
        };
        Ball_KGS.prototype.constructThisListenSignals = function () {
            var ball = this.entity;
            ball.onEndContact.add(this.handleEndContact, this);
        };
        Ball_KGS.prototype.handleEndContact = function (_fThis, fThat) {
            if (this.entity.isHeld || fThat.IsSensor()) {
                return;
            }
            // bounce erratically
            var vBall = this.entity.g.body.velocity;
            vBall.x += vBall.x * XG.Consts.PHI * (Math.random() - Math.random());
            vBall.y += vBall.y * XG.Consts.PHI * (Math.random() - Math.random());
        };
        return Ball_KGS;
    }(XG.A_));
    XG.Ball_KGS = Ball_KGS;
    /**
     * unique watermelon ball properties:
     * faster drop, heavy, less bounce, pull other balls
     */
    var Ball_KWM = /** @class */ (function (_super) {
        __extends(Ball_KWM, _super);
        function Ball_KWM() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Ball_KWM.prototype.constructThis = function () {
            this.constructThisProperties();
            this.constructThisGraphicEffect();
            this.constructThisTweenEffect();
        };
        Ball_KWM.prototype.constructThisProperties = function () {
            var ball = this.entity, bBall = ball.g.body;
            ball.color = XG.Color.BALL_WM_GREEN;
            // faster drop
            ball.gravityScale_drop *= 2;
            // heavy
            ball.mass_x1 *= 2;
            bBall.mass = ball.mass_x1;
            // less bounce
            bBall.restitution /= 2;
            this.entity.onHoldChange.add(this.handleHoldingChange, this);
            XG.Gm.ie.onUpdate.add(this.update, this);
        };
        Ball_KWM.prototype.constructThisGraphicEffect = function () {
            var diameter = Ball.DIAMETER + 64;
            var g = XG.Gm.ie.add.graphics(0, 0);
            g.lineStyle(4, XG.Color.BALL_WM_GREEN);
            g.drawCircle(0, 0, diameter);
            diameter -= 7;
            g.lineStyle(4, XG.Color.WHITE);
            g.drawCircle(0, 0, diameter);
            diameter -= 11;
            g.lineStyle(8, XG.Color.BALL_WM_RED);
            g.drawCircle(0, 0, diameter);
            g.alpha = 0;
            this.entity.g.addChild(g);
            this.gEffectPull = g;
        };
        Ball_KWM.prototype.constructThisTweenEffect = function () {
            var g = this.gEffectPull;
            var dur = 777;
            var ease = Phaser.Easing.Cubic.In;
            var twAlpha = XG.Gm.ie.add.tween(g);
            twAlpha.to({ alpha: 0.77 }, dur, ease);
            twAlpha.yoyo(true);
            this.twEffectAlpha = twAlpha;
            var twScale = XG.Gm.ie.add.tween(g.scale);
            twScale.to({ x: 0, y: 0 }, dur, ease);
            twScale.yoyo(true);
            this.twEffectScale = twScale;
        };
        Ball_KWM.prototype.handleHoldingChange = function (isInHands) {
            var g = this.gEffectPull;
            if (isInHands) {
                // loop attract effect
                this.twEffectAlpha.repeat(-1);
                this.twEffectAlpha.start();
                this.twEffectScale.repeat(-1);
                this.twEffectScale.start();
                this.soundEffectPull = XG.Gm.ie.sound.play(XG.Ks.attractBall, undefined, true);
            }
            else {
                // complete attract effect
                this.twEffectAlpha.repeat(0);
                this.twEffectScale.repeat(0);
                this.soundEffectPull.fadeOut();
                this.soundEffectPull.onFadeComplete.add(this.stopSoundEffectAttract, this);
            }
        };
        Ball_KWM.prototype.stopSoundEffectAttract = function (sound) {
            sound.stop();
            this.soundEffectPull = null;
        };
        Ball_KWM.prototype.update = function () {
            if (this.entity.isHeld) {
                this.updateAttractBalls();
            }
        };
        Ball_KWM.prototype.updateAttractBalls = function () {
            var maxAx = Ball_KWM.ACCELERATION_PULL, minAx = -maxAx;
            var bThis = this.entity.g.body;
            var balls = XG.MrStage.ie.balls;
            for (var _i = 0, _a = [balls[XG.Ks.ballFC], balls[XG.Ks.ballGS]]; _i < _a.length; _i++) {
                var ball = _a[_i];
                var bBall = ball.g.body;
                var dx = bThis.x - bBall.x, ax = Phaser.Math.clamp(dx, minAx, maxAx);
                bBall.velocity.x += ax;
            }
        };
        Ball_KWM.ACCELERATION_PULL = XG.Consts.E;
        return Ball_KWM;
    }(XG.A_));
    XG.Ball_KWM = Ball_KWM;
})(XG || (XG = {}));
// Detect Device
var XG;
(function (XG) {
    /**
     * functions from:
     * https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
     */
    var DetectDevice = /** @class */ (function () {
        function DetectDevice() {
        }
        Object.defineProperty(DetectDevice, "isMobile", {
            get: function () {
                var result = false;
                (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                    result = true; })(navigator.userAgent || navigator.vendor || window['opera']);
                return result;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(DetectDevice, "isMobileOrTablet", {
            get: function () {
                var result = false;
                (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                    result = true; })(navigator.userAgent || navigator.vendor || window['opera']);
                return result;
            },
            enumerable: true,
            configurable: true
        });
        ;
        return DetectDevice;
    }());
    XG.DetectDevice = DetectDevice;
})(XG || (XG = {}));
// Effects
var XG;
(function (XG) {
    var EffectBurstScore = /** @class */ (function () {
        function EffectBurstScore(x, y, gravity, kBall) {
            var ksBalls2Particles = EffectBurstScore.ksBalls2Particles, ksParticles = ksBalls2Particles[kBall];
            var emitter = XG.Gm.ie.add.emitter(x, y, 100);
            emitter.particleClass = ParticleBD;
            emitter.makeParticles(ksParticles);
            emitter.gravity = gravity;
            emitter.minParticleScale = 0.1;
            emitter.maxParticleScale = 1;
            emitter.setXSpeed(gravity.x - gravity.y / 3, gravity.x + gravity.y / 3);
            emitter.start(true, 4000, null, 100);
            XG.MrStage.ie.groupBall.add(emitter);
            this.emitter = emitter;
            // tween emitter alpha to 0
            var tw = XG.Gm.ie.add.tween(emitter);
            var propertiesTw = { alpha: 0 };
            tw.to(propertiesTw, 1000, Phaser.Easing.Quadratic.In);
            tw.start();
            tw.onComplete.addOnce(this.destructor, this);
        }
        EffectBurstScore.prototype.destructor = function () {
            this.emitter.destroy();
        };
        EffectBurstScore.ksBalls2Particles = XG.GmH.toK2VFromK0V1s(XG.Ks.ballFC, [XG.Ks.particle + XG.Color.WHITE, XG.Ks.particle + XG.Color.BALL_FC], XG.Ks.ballGS, [XG.Ks.particle + XG.Color.WHITE, XG.Ks.particle + XG.Color.BALL_GS], XG.Ks.ballWM, [XG.Ks.particle + XG.Color.WHITE,
            XG.Ks.particle + XG.Color.BALL_WM_GREEN,
            XG.Ks.particle + XG.Color.BALL_WM_RED
        ]);
        return EffectBurstScore;
    }());
    XG.EffectBurstScore = EffectBurstScore;
    /** BitmapData particle */
    var ParticleBD = /** @class */ (function (_super) {
        __extends(ParticleBD, _super);
        function ParticleBD(game, x, y, key) {
            return _super.call(this, game, x, y, XG.Gm.ie.cache.getBitmapData(key)) || this;
        }
        return ParticleBD;
    }(Phaser.Particle));
    XG.ParticleBD = ParticleBD;
    var EffectGravitySpike = /** @class */ (function () {
        function EffectGravitySpike(x, y, colors) {
            var gm = XG.Gm.ie;
            // draw segments (S) dotting around concentric rings (R)
            // tween rings to drop and expand explosively
            var groupR = XG.MrStage.ie.groupEffects, gsR = [], numR = 4, numSPerR = 64;
            /** radius of outermost ring */
            var radiusROut = 64;
            /** rotational increment between adjacent segments */
            var offsetRotationS = box2d.b2_two_pi / numSPerR;
            var EaseQ = Phaser.Easing.Quadratic;
            for (var iR = 0; iR < numR; iR++) {
                var gR = gm.add.graphics(x, y, groupR);
                var iRInv = numR - iR;
                // inner rings more smaller
                var radiusR = radiusROut - 8 * iRInv;
                // inner rings' segments more thinner
                var lineWidthS = 7 * Math.pow(iRInv / numR, 2);
                // draw ring
                for (var iS = 0; iS < numSPerR; iS++) {
                    var color = gm.rnd.pick(colors);
                    gR.lineStyle(lineWidthS, color, 0.25);
                    var rotationS = iS * offsetRotationS;
                    var x0S = radiusR * Math.cos(rotationS), x1S = radiusROut * Math.cos(rotationS), y0S = radiusR * Math.sin(rotationS), y1S = radiusROut * Math.sin(rotationS);
                    gR.moveTo(x0S, y0S);
                    gR.lineTo(x1S, y1S);
                }
                var scaleG = gR.scale;
                scaleG.x = scaleG.y = 0;
                // tween ring
                // inner rings tween more time
                var dur = XG.MC_GravitySpike.DURATION_COOLDOWN + 250 * iR;
                var propertiesTwAlphaY = {
                    alpha: 0,
                    y: gR.y + Math.pow(10 * iR, 2) // inner rings drop more
                };
                var twAlphaY = XG.Gm.ie.add.tween(gR);
                twAlphaY.to(propertiesTwAlphaY, dur, EaseQ.In);
                twAlphaY.start();
                var propertiesTwScale = {
                    x: 2 + iR,
                    y: 2 + 2 * iR // inner rings stretch more downward
                };
                var twScale = XG.Gm.ie.add.tween(scaleG);
                twScale.to(propertiesTwScale, dur, EaseQ.Out);
                twScale.start();
            }
            twScale.onComplete.addOnce(this.destructor, this);
            this.gs = gsR;
        }
        EffectGravitySpike.prototype.destructor = function () {
            var gs = this.gs;
            for (var _i = 0, gs_1 = gs; _i < gs_1.length; _i++) {
                var g = gs_1[_i];
                g.destroy();
            }
        };
        return EffectGravitySpike;
    }());
    XG.EffectGravitySpike = EffectGravitySpike;
    var EffectObjTweenout = /** @class */ (function () {
        function EffectObjTweenout(obj, propertiesTween) {
            this.obj = obj;
            XG.MrStage.ie.groupEffects.add(obj);
            // set tween properties
            var duration = 2000;
            var offsetY = -100;
            if (propertiesTween) {
                duration = propertiesTween.duration || duration;
                offsetY = propertiesTween.offsetY || offsetY;
            }
            var yTo = obj.y + offsetY;
            // tween obj
            var propertiesTw = { alpha: 0, y: yTo };
            var tw = XG.Gm.ie.add.tween(obj);
            tw.to(propertiesTw, duration, Phaser.Easing.Quadratic.In);
            tw.start();
            tw.onComplete.addOnce(this.destructor, this);
        }
        EffectObjTweenout.prototype.destructor = function () {
            this.obj.destroy();
        };
        return EffectObjTweenout;
    }());
    XG.EffectObjTweenout = EffectObjTweenout;
    var EffectAfroGlitter = /** @class */ (function () {
        function EffectAfroGlitter(x, y) {
            var gm = XG.Gm.ie;
            var alphaFlare = gm.rnd.realInRange(0.25, 1), lFlare = 16, wFlare = gm.rnd.realInRange(2, 6);
            var g = XG.Gm.ie.add.graphics(x, y);
            g.beginFill(XG.Color.WHITE, alphaFlare);
            g.drawPolygon(// horizontal flare
            0, -lFlare, -wFlare, 0, 0, lFlare, wFlare, 0);
            g.drawPolygon(// vertical flare
            0, -wFlare, -lFlare, 0, 0, wFlare, lFlare, 0);
            g.scale.x = g.scale.y = Math.random();
            var propertiesTween = {
                duration: XG.Gm.ie.rnd.realInRange(100, 1000),
                offsetY: -16 * Math.random()
            };
            new EffectObjTweenout(g, propertiesTween);
        }
        return EffectAfroGlitter;
    }());
    XG.EffectAfroGlitter = EffectAfroGlitter;
    var EffectText = /** @class */ (function () {
        function EffectText(x, y, text, propertiesText, propertiesTween) {
            propertiesText = propertiesText || {};
            var font = propertiesText.font || XG.Ks.font0, size = propertiesText.size || 32;
            var txt = XG.Gm.ie.add.bitmapText(x, y, font, text, size);
            txt.align = 'center';
            txt.anchor.setTo(0.5, 0.5);
            txt.tint = propertiesText.tint || XG.Color.WHITE;
            new EffectObjTweenout(txt, propertiesTween);
        }
        return EffectText;
    }());
    XG.EffectText = EffectText;
})(XG || (XG = {}));
// Main Character
var XG;
(function (XG) {
    var MC = /** @class */ (function () {
        function MC() {
            this._onBeginContact = new Phaser.Signal();
            this._onEndContact = new Phaser.Signal();
            this._onUpdate = new Phaser.Signal();
            this.tierBonus = XG.MrTierBonus.Tiers[0];
            this.constructHeadTorso();
            this.constructLimbs();
            this.constructComponents();
            XG.Gm.ie.onUpdate.add(this.update, this);
        }
        Object.defineProperty(MC.prototype, "onBeginContact", {
            // signals
            /** dispatch(fThis: BF, fThat: BF) */
            get: function () { return this._onBeginContact; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC.prototype, "onEndContact", {
            /** dispatch(fThis: BF, fThat: BF) */
            get: function () { return this._onEndContact; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC.prototype, "onUpdate", {
            get: function () { return this._onUpdate; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC.prototype, "gsLimbFront", {
            get: function () { return this.gsLimbs[0]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC.prototype, "xyAfro", {
            get: function () {
                var MCC = MCConstruct;
                var xyAfro_head = new PIXI.Point(MCC.dxAfro, MCC.dyAfro);
                return XG.Gm.ie.stage.toLocal(xyAfro_head, this.gHead);
            },
            enumerable: true,
            configurable: true
        });
        /** head, chest, gut, hip */
        MC.prototype.constructHeadTorso = function () {
            this.constructHeadTorsoGraphics();
            this.constructHeadTorsoBodies();
            this.constructHeadTorsoJoints();
        };
        MC.prototype.constructHeadTorsoGraphics = function () {
            var gmAdd = XG.Gm.ie.add;
            var group = XG.MrStage.ie.groupMCMiddle;
            var MCC = MCConstruct;
            var x = XG.MrSettings.X0_MC, y = XG.MrSettings.Y0_MC;
            var gHip = gmAdd.sprite(x, y, XG.Ks.mcHip, null, group);
            this.gHip = gHip;
            y -= MCC.hHip;
            var gGut = gmAdd.sprite(x, y, XG.Ks.mcGut, null, group);
            this.gGut = gGut;
            y -= MCC.hGut;
            var gChest = gmAdd.sprite(x, y, XG.Ks.mcChest, null, group);
            this.gChest = gChest;
            y -= MCC.hChest;
            var gHead = gmAdd.sprite(x, y, XG.Ks.mcHead, null, group);
            this.gHead = gHead;
        };
        MC.prototype.constructHeadTorsoBodies = function () {
            var MCC = MCConstruct;
            var hwTorso = MCC.hwTorso;
            var bHip = XG.GmPhysics.enable(this.gHip);
            bHip.setPolygon([
                -hwTorso, 0,
                hwTorso, 0,
                0, -MCC.hHip
            ]);
            var rGut = MCC.rGut;
            var bGut = XG.GmPhysics.enable(this.gGut);
            bGut.setCircle(rGut, 0, -rGut);
            // adding a larger non-collideable fixture improves joint stability
            var fSensorGut = bGut.addCircle(MCC.u, 0, -rGut);
            XG.GmPhysics.disableContactsFixture(fSensorGut);
            var bChest = XG.GmPhysics.enable(this.gChest);
            bChest.setPolygon([
                -hwTorso, -MCC.hChest,
                hwTorso, -MCC.hChest,
                0, 0
            ]);
            var fShoulder = bChest.addCircle(MCC.wLimb, -MCC.dxShoulder, MCC.dyShoulder);
            var bHead = XG.GmPhysics.enable(this.gHead);
            var fHead = bHead.setCircle(MCC.rHead, 0, -MCC.rHead);
            // head does not have significant weight
            fHead.GetMassData().mass = XG.GmPhysics.MIN_MASS;
            var fAfro = bHead.addCircle(MCC.rAfro, MCC.dxAfro, MCC.dyAfro);
            fAfro[XG.Ks.k] = XG.Ks.fAfro;
            fAfro.SetUserData(this);
            // afro does not have significant weight
            fAfro.GetMassData().mass = XG.GmPhysics.MIN_MASS;
            // afro absorbs slide and bounce
            fAfro.SetFriction(1);
            fAfro.SetRestitution(0);
            // set collision
            var cCategory = XG.Collision.MC | XG.Collision.MC_TORSO, cMask = XG.Collision.BOUNDARY | XG.Collision.BALL
                | XG.Collision.HOOP;
            for (var _i = 0, _a = [bHip, bGut, bChest, bHead]; _i < _a.length; _i++) {
                var b = _a[_i];
                b.setCollisionCategory(cCategory);
                b.setCollisionMask(cMask);
            }
            // front shoulder fixture prevents held ball from passing through it
            // while minimally affecting ball throw
            fShoulder.GetFilterData().categoryBits |= XG.Collision.MC_SHOULDER;
            fShoulder.SetFriction(0);
            fShoulder.SetRestitution(0);
        };
        MC.prototype.constructHeadTorsoJoints = function () {
            var gmB2D = XG.Gm.ie.b2d;
            var MCC = MCConstruct;
            this.jHipGut = gmB2D.revoluteJoint(this.gHip, this.gGut, 0, -MCC.hHip, 0, 0, 0, 0, false, 0, 5, true);
            this.jGutChest = gmB2D.revoluteJoint(this.gGut, this.gChest, 0, -MCC.hGut, 0, 0, 0, 0, false, 0, 5, true);
            var hChest = MCC.hChest;
            this.jNeck = gmB2D.revoluteJoint(this.gChest, this.gHead, 0, -hChest, 0, 0, 0, 0, false, -10, 10, true);
            // prevent torso from overbending
            /** y distance from bottom of hip to top of chest */
            var dyHipChest = MCC.hTorso, hwTorso = MCC.hwTorso;
            gmB2D.distanceJoint(this.gHip, this.gChest, dyHipChest, hwTorso, 0, hwTorso, -hChest, 3, 0.25);
            gmB2D.distanceJoint(this.gHip, this.gChest, dyHipChest, -hwTorso, 0, -hwTorso, -hChest, 3, 0.25);
        };
        /** arm, legs */
        MC.prototype.constructLimbs = function () {
            this.constructLimbsGraphics();
            this.constructLimbsBodies();
            this.constructLimbsJoints();
        };
        MC.prototype.constructLimbsGraphics = function () {
            var gmAdd = XG.Gm.ie.add;
            var MCC = MCConstruct;
            var hlArm = MCC.hlArm, hlLeg = MCC.hlLeg, hwTorso = MCC.hwTorso, hTorso = MCC.hTorso, x = XG.MrSettings.X0_MC, y = XG.MrSettings.Y0_MC;
            var gsLimbs = [];
            for (var i = 0; i < 2; i++) {
                var isFront = i == 0;
                var signDx = (isFront) ? -1 : 1;
                var dxTorso = signDx * hwTorso;
                var xArm = x + dxTorso, yArm = y - hTorso;
                var groupArm = (isFront)
                    ? XG.MrStage.ie.groupMCFront
                    : XG.MrStage.ie.groupMCBack;
                var gHumerus = gmAdd.sprite(xArm, yArm, XG.Ks.mcHumerus, null, groupArm);
                xArm += hlArm;
                var gUlna = gmAdd.sprite(xArm, yArm, XG.Ks.mcUlna, null, groupArm);
                xArm += hlArm;
                var gHand = gmAdd.sprite(xArm, yArm, XG.Ks.mcHand, null, groupArm);
                var xLeg = x + dxTorso, yLeg = y;
                var groupLeg = (isFront)
                    ? XG.MrStage.ie.groupMCMiddle
                    : XG.MrStage.ie.groupMCBack;
                var gFemur = gmAdd.sprite(xLeg, yLeg, XG.Ks.mcFemur, null, groupLeg);
                yLeg += hlLeg;
                var gTibia = gmAdd.sprite(xLeg, yLeg, XG.Ks.mcTibia, null, groupLeg);
                yLeg += hlLeg;
                var gFoot = gmAdd.sprite(xLeg, yLeg, XG.Ks.mcFoot, null, groupLeg);
                gsLimbs[i] = {
                    gHumerus: gHumerus,
                    gUlna: gUlna,
                    gHand: gHand,
                    gFemur: gFemur,
                    gTibia: gTibia,
                    gFoot: gFoot
                };
                if (isFront) {
                    this.gHumerusF = gHumerus;
                    this.gUlnaF = gUlna;
                    this.gHandF = gHand;
                    this.gFemurF = gFemur;
                    this.gTibiaF = gTibia;
                    this.gFootF = gFoot;
                }
                else {
                    this.gHumerusB = gHumerus;
                    this.gUlnaB = gUlna;
                    this.gHandB = gHand;
                    this.gFemurB = gFemur;
                    this.gTibiaB = gTibia;
                    this.gFootB = gFoot;
                }
            }
            this.gsLimbs = gsLimbs;
        };
        MC.prototype.constructLimbsBodies = function () {
            var MCC = MCConstruct;
            var wLimb = MCC.wLimb;
            var hlArm = MCC.hlArm, rHand = MCC.rHand;
            var hlLeg = MCC.hlLeg, hFoot = MCC.hFoot, lFoot = MCC.lFoot;
            var gsLimbs = this.gsLimbs;
            for (var i = 0; i < gsLimbs.length; i++) {
                var gsLimb = gsLimbs[i];
                var oxHLArm = hlArm / 2;
                var bHumerus = XG.GmPhysics.enable(gsLimb.gHumerus);
                bHumerus.setRectangle(hlArm, wLimb, oxHLArm, 0);
                var bUlna = XG.GmPhysics.enable(gsLimb.gUlna);
                var fUlna = bUlna.setRectangle(hlArm, wLimb, oxHLArm, 0);
                fUlna.SetUserData(this);
                var bHand = XG.GmPhysics.enable(gsLimb.gHand);
                var fHand = bHand.setCircle(rHand, rHand);
                fHand[XG.Ks.k] = XG.Ks.fHand;
                fHand.SetUserData(this);
                var bFemur = XG.GmPhysics.enable(gsLimb.gFemur);
                bFemur.addRectangle(wLimb, hlLeg, 0, hlLeg / 2);
                var bTibia = XG.GmPhysics.enable(gsLimb.gTibia);
                bTibia.addRectangle(wLimb, hlLeg, 0, hlLeg / 2);
                var bFoot = XG.GmPhysics.enable(gsLimb.gFoot), dxBFoot = -6;
                var fFoot = bFoot.addRectangle(lFoot, hFoot, lFoot / 2 + dxBFoot, hFoot / 2);
                fFoot[XG.Ks.k] = XG.Ks.fFoot;
                fFoot.SetUserData(this);
                // set collision
                var cCategory = XG.Collision.MC | XG.Collision.MC_LIMB, cMask = XG.Collision.BOUNDARY | XG.Collision.HOOP;
                for (var _i = 0, _a = [bHumerus, bUlna, bFemur, bTibia, bFoot]; _i < _a.length; _i++) {
                    var b = _a[_i];
                    b.setCollisionCategory(cCategory);
                    b.setCollisionMask(cMask);
                }
                // hand should be able to touch ball
                bHand.setCollisionCategory(cCategory | XG.Collision.MC_HAND);
                bHand.setCollisionMask(cMask | XG.Collision.BALL);
                // leg counterweights to prevent swing from excess torquing
                for (var _b = 0, _c = [bFemur, bTibia]; _b < _c.length; _b++) {
                    var b = _c[_b];
                    var fCounterWeight = b.addRectangle(wLimb, hlLeg, 0, -hlLeg / 2);
                    XG.GmPhysics.disableContactsFixture(fCounterWeight);
                }
            }
        };
        MC.prototype.constructLimbsJoints = function () {
            var gmB2D = XG.Gm.ie.b2d;
            var MCC = MCConstruct;
            var hlArm = MCC.hlArm;
            var hlLeg = MCC.hlLeg;
            var gsLimbs = this.gsLimbs;
            for (var i = 0; i < gsLimbs.length; i++) {
                var gsLimb = gsLimbs[i];
                var isFront = i == 0;
                var signDx = (isFront) ? -1 : 1;
                var jShoulder = gmB2D.revoluteJoint(this.gChest, gsLimb.gHumerus, signDx * MCC.dxShoulder, MCC.dyShoulder, 0, 0);
                // kill rotation limits to make control smoother
                //, false, -90, 135, true);
                var jElbow = gmB2D.revoluteJoint(gsLimb.gHumerus, gsLimb.gUlna, hlArm, 0, 0, 0, 0, 0, false, -160, 0, true);
                var jWrist = gmB2D.revoluteJoint(gsLimb.gUlna, gsLimb.gHand, hlArm, 0, 0, 0, 0, 0, false, -10, 10, true);
                var jHipLeg = gmB2D.revoluteJoint(this.gHip.body, gsLimb.gFemur, signDx * MCC.dxLegHip, MCC.dyLegHip, 0, 0, 0, 0, false, -60, 20, true);
                var jKnee = gmB2D.revoluteJoint(gsLimb.gFemur, gsLimb.gTibia, 0, hlLeg, 0, 0, 0, 0, false, 0, 135, true);
                var jAnkle = gmB2D.revoluteJoint(gsLimb.gTibia, gsLimb.gFoot, 0, hlLeg, 0, 0, 0, 0, false, -30, 30, true);
                if (isFront) {
                    this.jShoulderF = jShoulder;
                    this.jElbowF = jElbow;
                    this.jWristF = jWrist;
                    this.jHipLegF = jHipLeg;
                    this.jKneeF = jKnee;
                    this.jAnkleF = jAnkle;
                }
                else {
                    this.jShoulderB = jShoulder;
                    this.jElbowB = jElbow;
                    this.jWristB = jWrist;
                    this.jHipLegB = jHipLeg;
                    this.jKneeB = jKnee;
                    this.jAnkleB = jAnkle;
                }
            }
        };
        MC.prototype.constructComponents = function () {
            this.gravitySpike = new XG.MC_GravitySpike(this);
            this.jointsFixHypex = new XG.MC_JointsFixHyperextension(this);
            this.jointsStretch = new XG.MC_JointsStretch(this);
            this.jump = new XG.MC_Jump(this);
            this.locomotor = new XG.MC_Locomotor(this);
            this.sounds = new XG.MC_Sounds(this);
            this.updateAfro = new XG.MC_UpdateAfro(this);
            this.updateBall = new XG.MC_UpdateBall(this);
            this.updateBodies = new XG.MC_UpdateBodies(this);
            this.walkCycle = new XG.MC_WalkCycle(this);
            this.pupils = new XG.MC_Pupils(this); // after updateBall constructs
        };
        MC.prototype.handleBeginContact = function (fThis, fThat) {
            this.onBeginContact.dispatch(fThis, fThat);
        };
        MC.prototype.handleEndContact = function (fThis, fThat) {
            this.onEndContact.dispatch(fThis, fThat);
        };
        MC.prototype.update = function () {
            this.onUpdate.dispatch();
        };
        return MC;
    }());
    XG.MC = MC;
    /** construct variables for MC */
    var MCConstruct = /** @class */ (function () {
        function MCConstruct() {
        }
        Object.defineProperty(MCConstruct, "dxAfro", {
            get: function () { return -this.u / Math.sqrt(2); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "dxLegHip", {
            get: function () { return 3 * this.u / 8; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "dxShoulder", {
            get: function () { return this.u / 2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "dyAfro", {
            get: function () { return this.dxAfro - this.rHead; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "dyLegHip", {
            get: function () { return -this.u / 8; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "dyShoulder", {
            get: function () { return -7 * this.u / 8; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "hChest", {
            get: function () { return this.u; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "hGut", {
            get: function () { return 2 * this.rGut; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "hFoot", {
            get: function () { return this.wLimb; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "hHip", {
            get: function () { return this.u / 2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "hTorso", {
            get: function () {
                return this.hHip + this.hGut + this.hChest;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "hlArm", {
            get: function () { return 1.5 * this.u; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "hlLeg", {
            get: function () { return 1.5 * this.u; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "hwTorso", {
            get: function () { return this.u / 2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "lArmHand", {
            get: function () { return 2 * this.hlArm + this.rHand; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "lFoot", {
            get: function () { return 8 * this.wLimb; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "lLegFoot", {
            get: function () { return 2 * this.hlLeg + this.hFoot; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "rAfro", {
            get: function () { return 1.5 * this.rHead; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "rGut", {
            get: function () { return this.u / 4; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "rHand", {
            get: function () { return 2 * this.wLimb; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "rHead", {
            get: function () { return this.u; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MCConstruct, "wLimb", {
            get: function () { return 4; },
            enumerable: true,
            configurable: true
        });
        /** basic unit of bodypart measurement */
        MCConstruct.u = 32;
        return MCConstruct;
    }());
    XG.MCConstruct = MCConstruct;
})(XG || (XG = {}));
// Main Character Components
var XG;
(function (XG) {
    var MC_GravitySpike = /** @class */ (function (_super) {
        __extends(MC_GravitySpike, _super);
        function MC_GravitySpike() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isGravitySpikeReady = true;
            return _this;
        }
        MC_GravitySpike.prototype.constructThis = function () {
            XG.Gm.ie.onInputDown.add(this.handleClick, this);
        };
        MC_GravitySpike.prototype.handleClick = function () {
            if (!XG.MrSettings.ie.getV(XG.Ks.gravitySpike)) {
                return;
            }
            if (!this.isGravitySpikeReady) {
                return;
            }
            var gm = XG.Gm.ie;
            gm.onGravitySpike.dispatch();
            var xyAfro = this.entity.xyAfro, colorsAfro = this.entity.tierBonus.colors;
            new XG.EffectGravitySpike(xyAfro.x, xyAfro.y, colorsAfro);
            gm.sound.play(XG.Ks.gravitySpike);
            this.isGravitySpikeReady = false;
            var msCooldown = MC_GravitySpike.DURATION_COOLDOWN;
            gm.time.events.add(msCooldown, this.readyGravitySpike, this);
        };
        MC_GravitySpike.prototype.readyGravitySpike = function () {
            this.isGravitySpikeReady = true;
        };
        /** gravity spike cooldown and effect duration in milliseconds */
        MC_GravitySpike.DURATION_COOLDOWN = 777;
        return MC_GravitySpike;
    }(XG.A_));
    XG.MC_GravitySpike = MC_GravitySpike;
    /** ensure arm bends correctly at elbow */
    var MC_JointsFixHyperextension = /** @class */ (function (_super) {
        __extends(MC_JointsFixHyperextension, _super);
        function MC_JointsFixHyperextension() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MC_JointsFixHyperextension.prototype.constructThis = function () {
            XG.Gm.ie.onUpdate.add(this.fixElbowHyperextension, this);
        };
        MC_JointsFixHyperextension.prototype.fixElbowHyperextension = function () {
            var mc = this.entity;
            var gsLimbs = mc.gsLimbs, jsElbow = [mc.jElbowF, mc.jElbowB];
            for (var i = 0; i < 2; i++) {
                var rotJElbow = jsElbow[i].GetJointAngleRadians();
                if (!(rotJElbow < -box2d.b2_pi || rotJElbow > box2d.b2_pi)) {
                    continue;
                }
                // straighten humerus and ulna when hyperextension occurs
                var gsLimb = gsLimbs[i];
                var bHumerus = gsLimb.gHumerus.body, bUlna = gsLimb.gUlna.body;
                bHumerus.rotation = bUlna.rotation
                    = (bHumerus.rotation + bUlna.rotation) / 2;
            }
        };
        return MC_JointsFixHyperextension;
    }(XG.A_));
    XG.MC_JointsFixHyperextension = MC_JointsFixHyperextension;
    /**
     * Box2D often does not always resolve 2 jointed bodies in time for render
     * draw a lines between joint gaps when they occur
     * so that limbs do not look separated
     */
    var MC_JointsStretch = /** @class */ (function (_super) {
        __extends(MC_JointsStretch, _super);
        function MC_JointsStretch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MC_JointsStretch.prototype.constructThis = function () {
            this.constructThisGraphicsJointsStretch();
            this.constructThisJointsWidths();
            XG.Gm.ie.onPreRender.add(this.preRender, this);
        };
        MC_JointsStretch.prototype.constructThisGraphicsJointsStretch = function () {
            var mrStage = XG.MrStage.ie, groupsJointsStretch = [
                mrStage.groupMCFront,
                mrStage.groupMCMiddle,
                mrStage.groupMCBack
            ], gsJointStretch = [];
            for (var _i = 0, groupsJointsStretch_1 = groupsJointsStretch; _i < groupsJointsStretch_1.length; _i++) {
                var group = groupsJointsStretch_1[_i];
                var gJS = XG.Gm.ie.add.graphics(0, 0, group);
                group.sendToBack(gJS);
                gsJointStretch.push(gJS);
            }
            this.gsJointStretch = gsJointStretch;
        };
        MC_JointsStretch.prototype.constructThisJointsWidths = function () {
            var mc = this.entity;
            var gs = this.gsJointStretch;
            this.gs_js_ws = [
                [gs[1], mc.jHipGut, 16],
                [gs[1], mc.jGutChest, 16],
                [gs[1], mc.jNeck, 8],
                [gs[0], mc.jShoulderF, 6], [gs[1], mc.jShoulderB, 6],
                [gs[0], mc.jElbowF, 5], [gs[2], mc.jElbowB, 5],
                [gs[0], mc.jWristF, 4], [gs[2], mc.jWristB, 4],
                [gs[1], mc.jHipLegF, 8], [gs[1], mc.jHipLegB, 8],
                [gs[1], mc.jKneeF, 5], [gs[1], mc.jKneeB, 5],
                [gs[1], mc.jAnkleF, 4], [gs[1], mc.jAnkleB, 4]
            ];
        };
        MC_JointsStretch.prototype.preRender = function () {
            // prepare graphics to draw joints
            var gsJointStretch = this.gsJointStretch;
            for (var _i = 0, gsJointStretch_1 = gsJointStretch; _i < gsJointStretch_1.length; _i++) {
                var g = gsJointStretch_1[_i];
                g.clear();
            }
            // draw connections between overstretched joints
            var b2d = XG.Gm.ie.b2d;
            var color = XG.Color.MC_SKIN;
            var gs_js_ws = this.gs_js_ws;
            for (var _a = 0, gs_js_ws_1 = gs_js_ws; _a < gs_js_ws_1.length; _a++) {
                var g_j_w = gs_js_ws_1[_a];
                var g = g_j_w[0], j = g_j_w[1], w = g_j_w[2];
                var jAnchorA = j.GetAnchorA(new box2d.b2Vec2()), jAnchorB = j.GetAnchorB(new box2d.b2Vec2());
                g.lineStyle(w, color);
                g.moveTo(b2d.mpx(-jAnchorA.x), b2d.mpx(-jAnchorA.y));
                g.lineTo(b2d.mpx(-jAnchorB.x), b2d.mpx(-jAnchorB.y));
            }
        };
        return MC_JointsStretch;
    }(XG.A_));
    XG.MC_JointsStretch = MC_JointsStretch;
    var MC_Jump = /** @class */ (function (_super) {
        __extends(MC_Jump, _super);
        function MC_Jump() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * @example 'jump_ready': can jump
             * @example 'jump_started': can jump - check before continuing
             * @example 'jump_stopped': can't jump
             */
            _this.state = XG.Ks.jump_stopped;
            return _this;
        }
        Object.defineProperty(MC_Jump, "DyJumpThreshold", {
            get: function () { return -XG.Gm.ie.height / 2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC_Jump.prototype, "bsToJump", {
            get: function () {
                var mc = this.entity;
                return [
                    mc.locomotor.bMotor,
                    mc.locomotor.bSeat,
                    mc.gHip.body,
                    mc.gGut.body,
                    mc.gChest.body,
                    mc.gHead.body
                ];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC_Jump.prototype, "maxY", {
            get: function () {
                var result = XG.Hoop.Y / 4;
                // MC can jump higher as score increases
                result -= XG.MrVsGm.ie.vScore;
                return result;
            },
            enumerable: true,
            configurable: true
        });
        MC_Jump.prototype.constructThis = function () {
            this.entity.onBeginContact.add(this.handleBeginContact, this);
            this.entity.onUpdate.add(this.update, this);
        };
        MC_Jump.prototype.handleBeginContact = function (fThis, _fThat) {
            var kThis = fThis[XG.Ks.k];
            if (kThis === XG.Ks.fLomoStep || kThis === XG.Ks.fFoot) {
                this.jumpReady();
            }
        };
        /** ready to jump again after landing */
        MC_Jump.prototype.jumpReady = function () {
            this.setGravityScale(XG.GmPhysics.GRAVITYSCALE_x1);
            this.state = XG.Ks.jump_ready;
        };
        MC_Jump.prototype.jumpStart = function () {
            this.setGravityScale(XG.GmPhysics.GRAVITYSCALE_x1);
            this.jumpUpdate();
            this.state = XG.Ks.jump_started;
        };
        MC_Jump.prototype.jumpStop = function () {
            // Mario-style post-jump drop
            this.setGravityScale(XG.GmPhysics.GRAVITYSCALE_DROP);
            this.state = XG.Ks.jump_stopped;
        };
        MC_Jump.prototype.jumpUpdate = function () {
            var bs = this.bsToJump, bLomo = bs[0];
            // calculate projected jump limit, given current velocity
            var ay = XG.Gm.ie.b2d.gravity.y;
            var vyBLomo = bLomo.velocity.y;
            var yJump = bLomo.y - (vyBLomo * vyBLomo) / (2 * ay);
            var isFinishedJump = yJump <= this.maxY // can't jump above max height
                || vyBLomo >= 0; // can't jump when falling;
            if (isFinishedJump) {
                this.jumpStop();
                return;
            }
            // continue jumping as input is rising
            var dyJump = XG.MrInput.ie.dyPerSecond;
            if (dyJump >= 0) {
                return;
            }
            // limit jump speed
            dyJump = Math.max(-128, dyJump);
            for (var _i = 0, bs_1 = bs; _i < bs_1.length; _i++) {
                var b = bs_1[_i];
                b.velocity.y += dyJump;
            }
        };
        MC_Jump.prototype.setGravityScale = function (value) {
            var bs = this.bsToJump;
            for (var _i = 0, bs_2 = bs; _i < bs_2.length; _i++) {
                var b = bs_2[_i];
                b.gravityScale = value;
            }
        };
        MC_Jump.prototype.update = function () {
            switch (this.state) {
                case XG.Ks.jump_ready:
                    var dyPerSecond = XG.MrInput.ie.dyPerSecond;
                    if (dyPerSecond < MC_Jump.DyJumpThreshold) {
                        this.jumpStart();
                    }
                    break;
                case XG.Ks.jump_started:
                    this.jumpUpdate();
                    break;
                case XG.Ks.jump_stopped:
                default:
                    break;
            }
        };
        return MC_Jump;
    }(XG.A_));
    XG.MC_Jump = MC_Jump;
    /** invisible unicycle that drives character */
    var MC_Locomotor = /** @class */ (function (_super) {
        __extends(MC_Locomotor, _super);
        function MC_Locomotor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(MC_Locomotor.prototype, "dyMotor", {
            // construct variables
            get: function () { return this.rMotor + XG.MCConstruct.dyLegHip; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC_Locomotor.prototype, "rMotor", {
            get: function () { return XG.MCConstruct.lLegFoot / 2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC_Locomotor.prototype, "rpsMotor", {
            get: function () { return 1; },
            enumerable: true,
            configurable: true
        });
        MC_Locomotor.prototype.constructThis = function () {
            this.constructThisBodies();
            this.constructThisJoints();
            this.entity.onUpdate.add(this.update, this);
        };
        MC_Locomotor.prototype.constructThisBodies = function () {
            var gm = XG.Gm.ie;
            var rMotor = this.rMotor, x = this.entity.gHip.x, y = this.entity.gHip.y;
            // seat:
            var bSeat = new Phaser.Physics.Box2D.Body(gm, null, x, y);
            bSeat.fixedRotation = true;
            bSeat.setCircle(XG.MCConstruct.u / 2);
            this.bSeat = bSeat;
            // motor:
            var bMotor = new Phaser.Physics.Box2D.Body(gm, null, x, y);
            bMotor.setCircle(rMotor);
            // motor: step sensor for each foot
            var numSS = 2, radiusSS = 4;
            for (var i = 0; i < numSS; i++) {
                var rotationSS = box2d.b2_two_pi * i / numSS, xSS = rMotor * Math.cos(rotationSS), ySS = rMotor * Math.sin(rotationSS);
                var fSS = bMotor.addCircle(radiusSS, xSS, ySS);
                fSS.SetSensor(true);
                fSS.SetUserData(this);
                fSS[XG.Ks.k] = XG.Ks.fLomoStep;
            }
            bMotor.friction = 4;
            bMotor.mass *= 8;
            this.bMotor = bMotor;
            // set collision
            for (var _i = 0, _a = [bSeat, bMotor]; _i < _a.length; _i++) {
                var b = _a[_i];
                b.setCollisionCategory(XG.Collision.MC);
                b.setCollisionMask(XG.Collision.GROUND);
            }
        };
        MC_Locomotor.prototype.constructThisJoints = function () {
            var gmB2D = XG.Gm.ie.b2d;
            this.jSeat = gmB2D.prismaticJoint(this.bSeat, this.entity.gHip.body, 0, 1, 0, 0, 0, 0, -32, 32, true, 0, 100, true);
            this.jMotor = gmB2D.wheelJoint(this.bSeat, this.bMotor, 0, this.dyMotor, 0, 0, 0, 1, 7, 0.5, 0, 7777, true);
        };
        MC_Locomotor.prototype.handleBeginContact = function (fThis, fThat) {
            var kThis = fThis[XG.Ks.k];
            if (kThis === XG.Ks.fLomoStep) {
                this.entity.onBeginContact.dispatch(fThis, fThat);
            }
        };
        MC_Locomotor.prototype.update = function () {
            var dxToMove = MC_Locomotor.DxToMove, dx = XG.Gm.ie.input.x - this.bMotor.x;
            if (Math.abs(dx) < dxToMove) {
                // stop moving when input is close to MC
                this.jMotor.SetMotorSpeed(0);
                return;
            }
            if (dx < 0) {
                // move left
                this.jMotor.SetMotorSpeed(-2 * Math.PI * this.rpsMotor);
            }
            else {
                // move right
                this.jMotor.SetMotorSpeed(2 * Math.PI * this.rpsMotor);
            }
        };
        MC_Locomotor.DxToMove = 64;
        return MC_Locomotor;
    }(XG.A_));
    XG.MC_Locomotor = MC_Locomotor;
    /**
     * MC has pupils in eyes;
     * when ready to throw ball, pupils dilate and track hoop;
     * otherwise, pupils track player input
     */
    var MC_Pupils = /** @class */ (function (_super) {
        __extends(MC_Pupils, _super);
        function MC_Pupils() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MC_Pupils.prototype.constructThis = function () {
            this.constructThisGraphics();
            this.constructThisListenSignals();
        };
        MC_Pupils.prototype.constructThisGraphics = function () {
            var gHead = this.entity.gHead;
            for (var i = 0; i < 2; i++) {
                var gPupil = XG.Gm.ie.add.graphics(0, 0, XG.MrStage.ie.groupMCMiddle);
                var isFront = i == 1;
                if (isFront) {
                    this.gPupilF = gPupil;
                }
                else {
                    this.gPupilB = gPupil;
                }
                var scale = (isFront) ? 1 : 0.75;
                gPupil.beginFill(XG.Color.BLACK);
                gPupil.drawCircle(0, 0, 10 * scale);
                // specular highlights
                gPupil.beginFill(XG.Color.WHITE);
                gPupil.drawCircle(2 * scale, -2 * scale, 4 * scale);
                gPupil.drawCircle(-2 * scale, -2 * scale, 2 * scale);
                gHead.addChild(gPupil);
            }
        };
        MC_Pupils.prototype.constructThisListenSignals = function () {
            var onStateChangeMCBall = this.entity.updateBall.onStateChange;
            onStateChangeMCBall.add(this.setSizePupilByStateMCBall, this);
            XG.Gm.ie.onPreRender.add(this.setPositionPupil, this);
        };
        MC_Pupils.prototype.setPositionPupil = function () {
            var stateBall = this.entity.updateBall.state;
            var target = (stateBall === XG.Ks.ball_throwReady)
                ? XG.MrStage.ie.hoop.g // look at hoop when ready to throw
                : XG.MrInput.ie;
            var dyCenterHead = -XG.MCConstruct.rHead;
            var gHead = this.entity.gHead;
            var gsPupils = [this.gPupilB, this.gPupilF];
            for (var i = 0; i < gsPupils.length; i++) {
                var gPupil = gsPupils[i];
                var isFront = i == 1;
                // position of eye relative to head
                var xyEye = (isFront)
                    ? new PIXI.Point(-5.5, dyCenterHead - 3.5)
                    : new PIXI.Point(27, dyCenterHead - 5);
                var xyTarget = gHead.toLocal(new PIXI.Point(target.x, target.y), null);
                // direction from eye to target
                var dE2T = new Phaser.Point(xyTarget.x, xyTarget.y);
                // do not move pupil beyond eye boundaries
                var dPupil = 2;
                dE2T.setMagnitude(Math.min(dPupil, dE2T.getMagnitude()));
                var dxPupil = xyEye.x + dE2T.x, dyPupil = xyEye.y + dE2T.y;
                gPupil.x = dxPupil;
                gPupil.y = dyPupil;
            }
        };
        MC_Pupils.prototype.setSizePupilByStateMCBall = function (state) {
            var scalePupilF = this.gPupilF.scale;
            var scalePupilB = this.gPupilB.scale;
            if (state == XG.Ks.ball_throwReady) {
                scalePupilF.x = scalePupilF.y =
                    scalePupilB.x = scalePupilB.y = XG.Consts.PHI;
                this.setSizePupilTween(true);
            }
            else {
                this.setSizePupilTween(false);
                scalePupilF.x = scalePupilF.y =
                    scalePupilB.x = scalePupilB.y = 1;
            }
        };
        MC_Pupils.prototype.setSizePupilTween = function (isDilating) {
            if (!isDilating) {
                if (this.twScalePupilF) {
                    this.twScalePupilF.stop();
                    this.twScalePupilB.stop();
                }
                return;
            }
            // after initial dilation, pupils contract to final scale
            var propertiesTw = { x: 1.25, y: 1.25 }, // final scale
            dur = 500, ease = Phaser.Easing.Quadratic.Out;
            var gsPupils = [this.gPupilF, this.gPupilB];
            for (var _i = 0, gsPupils_1 = gsPupils; _i < gsPupils_1.length; _i++) {
                var gPupil = gsPupils_1[_i];
                var twScalePupil = XG.Gm.ie.add.tween(this.gPupilF.scale);
                twScalePupil.to(propertiesTw, dur, ease);
                twScalePupil.start();
                if (gPupil == this.gPupilF) {
                    this.twScalePupilF = twScalePupil;
                }
                else {
                    this.twScalePupilB = twScalePupil;
                }
            }
        };
        return MC_Pupils;
    }(XG.A_));
    XG.MC_Pupils = MC_Pupils;
    var MC_Sounds = /** @class */ (function (_super) {
        __extends(MC_Sounds, _super);
        function MC_Sounds() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MC_Sounds.prototype.constructThis = function () {
            this.entity.onBeginContact.add(this.handleBeginContact, this);
        };
        MC_Sounds.prototype.handleBeginContact = function (fThis, fThat) {
            if (fThat.IsSensor()) {
                return;
            }
            var kThis = fThis[XG.Ks.k];
            if (kThis === XG.Ks.fAfro) {
                // emit no sound when held ball passes afro
                var ballThis = this.entity.updateBall.ball;
                if (ballThis && ballThis == fThat.GetUserData()) {
                    return;
                }
                XG.Gm.ie.sound.play(XG.Ks.afroHit);
                return;
            }
            var categThat = fThat.GetFilterData().categoryBits;
            if (kThis === XG.Ks.fFoot) {
                if (!(categThat & XG.Collision.GROUND)) {
                    return;
                }
                XG.Gm.ie.sound.play(XG.Ks.footStep);
            }
            else if (kThis === XG.Ks.fHand) {
                if (!(categThat & XG.Collision.BALL) ||
                    this.entity.updateBall.isTouchingBall) {
                    return;
                }
                XG.Gm.ie.sound.play(XG.Ks.ballHit);
            }
        };
        return MC_Sounds;
    }(XG.A_));
    XG.MC_Sounds = MC_Sounds;
    /** change afro to represent highest tier reached in current game session */
    var MC_UpdateAfro = /** @class */ (function (_super) {
        __extends(MC_UpdateAfro, _super);
        function MC_UpdateAfro() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MC_UpdateAfro.prototype.constructThis = function () {
            XG.MrVsGm.ie.onTierChange.add(this.updateAfro, this);
            XG.Gm.ie.time.events.add(1000, this.updateGlitter, this);
        };
        /** update afro graphic and glitter count */
        MC_UpdateAfro.prototype.updateAfro = function (iTier) {
            var tierCurrent = XG.MrTierBonus.Tiers[iTier];
            var mc = this.entity;
            mc.tierBonus = tierCurrent;
            mc.gHead.loadTexture(tierCurrent.kGHead);
            XG.Gm.ie.sound.play(tierCurrent.kSound);
        };
        MC_UpdateAfro.prototype.updateGlitter = function () {
            var gm = XG.Gm.ie;
            var numGlitters = this.entity.tierBonus.value;
            if (numGlitters <= 0) {
                // check again next second to see if afro has upgraded
                gm.time.events.add(1000, this.updateGlitter, this);
                return;
            }
            var mc = this.entity, mcc = XG.MCConstruct;
            var rAfro = mcc.rAfro, xyAfro = mc.xyAfro, xAfro = xyAfro.x, yAfro = xyAfro.y;
            var rHead = mcc.rHead;
            var xyCenterHead = new PIXI.Point(0, -mcc.rHead);
            xyCenterHead = gm.stage.toLocal(xyCenterHead, mc.gHead);
            var xCenterHead = xyCenterHead.x, yCenterHead = xyCenterHead.y;
            for (var i = 0; i < numGlitters; i++) {
                // position of glitter falls within afro's radius
                var rotation = gm.rnd.realInRange(0, box2d.b2_two_pi), magnitude = rAfro * Math.random(), offsetX = magnitude * Math.cos(rotation), xGlitter = xAfro + offsetX, offsetY = magnitude * Math.sin(rotation), yGlitter = yAfro + offsetY;
                // glitter on afro only; prevent glitter on face
                var dGlitter2Head = Phaser.Math.distance(xGlitter, yGlitter, xCenterHead, yCenterHead);
                if (dGlitter2Head < rHead) {
                    continue;
                }
                new XG.EffectAfroGlitter(xGlitter, yGlitter);
            }
            var delayNextGlitter = gm.rnd.realInRange(100, 1000);
            gm.time.events.add(delayNextGlitter, this.updateGlitter, this);
        };
        return MC_UpdateAfro;
    }(XG.A_));
    XG.MC_UpdateAfro = MC_UpdateAfro;
    var MC_UpdateBall = /** @class */ (function (_super) {
        __extends(MC_UpdateBall, _super);
        function MC_UpdateBall() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** joints to represent holding ball */
            _this.jsHand2Ball = [];
            _this._onStateChange = new Phaser.Signal();
            _this.numVs = 4;
            return _this;
        }
        Object.defineProperty(MC_UpdateBall.prototype, "state", {
            /**
             * @example null: ball not in hands
             * @example 'ball': ball just contacted hand
             * @example 'ball_unready': ball not ready to throw
             * @example 'ball_ready': ball ready to throw
             * @example 'ball_throwing': ball being thrown
             */
            get: function () { return this._state; },
            set: function (v) {
                this._state = v;
                this.onStateChange.dispatch(v);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC_UpdateBall.prototype, "onStateChange", {
            /** dispatch(v: string) */
            get: function () { return this._onStateChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC_UpdateBall.prototype, "isTouchingBall", {
            get: function () { return this.state != null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MC_UpdateBall.prototype, "target", {
            get: function () { return XG.MrInput.ie; },
            enumerable: true,
            configurable: true
        });
        MC_UpdateBall.prototype.constructThis = function () {
            this.entity.onBeginContact.add(this.handleBeginContact, this);
            this.entity.onUpdate.add(this.updateBall, this);
        };
        MC_UpdateBall.prototype.handleBeginContact = function (fThis, fThat) {
            var categThat = fThat.GetFilterData().categoryBits;
            if (categThat == XG.Collision.BALL && fThis[XG.Ks.k] === XG.Ks.fHand) {
                var ball = fThat.GetUserData();
                this.handleBeginContactBall(ball);
                return;
            }
            var categThis = fThis.GetFilterData().categoryBits;
            if (categThat == XG.Collision.HOOP && categThis & XG.Collision.MC_LIMB) {
                this.handleBeginContactHoop();
            }
        };
        /** handle hand-to-ball contact */
        MC_UpdateBall.prototype.handleBeginContactBall = function (ball) {
            if (!this.isTouchingBall && ball.isTouchable) {
                this.ball = ball;
            }
        };
        /** handle hoop contact for slam dunk */
        MC_UpdateBall.prototype.handleBeginContactHoop = function () {
            if (this.isTouchingBall) {
                this.state = XG.Ks.ball_release;
            }
        };
        /** handle when ball is forced out of hand */
        MC_UpdateBall.prototype.handleForceReleaseBall = function () {
            if (this.isTouchingBall) {
                this.state = XG.Ks.ball_release;
            }
        };
        Object.defineProperty(MC_UpdateBall.prototype, "canTouchOtherBalls", {
            set: function (v) {
                var gsLimbs = this.entity.gsLimbs;
                for (var _i = 0, gsLimbs_1 = gsLimbs; _i < gsLimbs_1.length; _i++) {
                    var gsLimb = gsLimbs_1[_i];
                    var bHand = gsLimb.gHand.body;
                    bHand.sensor = !v;
                }
            },
            enumerable: true,
            configurable: true
        });
        MC_UpdateBall.prototype.updateBall = function () {
            if (!this.isTouchingBall) {
                if (this.ball != null) {
                    // ball just grabbed; attach to hands
                    this.updateBallGrab();
                }
                else {
                    return;
                }
            }
            // ball is in hands
            var stateBall = this.state;
            if (stateBall === XG.Ks.ball_release) {
                this.updateBallRelease();
            }
            else if (stateBall === XG.Ks.ball_throwReady) {
                this.updateBallTrackVelocity();
                this.updateBallTryThrow();
                return;
            }
            else {
                this.updateBallSetThrowReady();
            }
        };
        MC_UpdateBall.prototype.updateBallGrab = function () {
            var ball = this.ball;
            ball.isHeld = true;
            ball.onForce.addOnce(this.handleForceReleaseBall, this);
            XG.Gm.ie.onBallGrabbed.dispatch();
            // add joints from hands to ball to hold ball
            var bBall = ball.g.body;
            var jsHand2Ball = this.jsHand2Ball;
            var rHand = XG.MCConstruct.rHand;
            for (var _i = 0, _a = this.entity.gsLimbs; _i < _a.length; _i++) {
                var gsLimb = _a[_i];
                var bHand = gsLimb.gHand.body;
                var jHand2Ball = (jsHand2Ball.length == 0)
                    // different joint types prevent joint solve conflicts
                    ? XG.Gm.ie.b2d.weldJoint(bHand, bBall, rHand, 0, 0, 0, 1, 1)
                    : XG.Gm.ie.b2d.ropeJoint(bHand, bBall, rHand, rHand);
                jsHand2Ball.push(jHand2Ball);
            }
            // prevent ball from spinning excessively in hands as
            // weld joint forces connected bodies to rotate back to 0
            bBall.angularVelocity = 0;
            bBall.rotation %= box2d.b2_two_pi;
            var gsLimbFront = this.entity.gsLimbFront;
            for (var k in gsLimbFront) {
                var bLimb = gsLimbFront[k].body;
                bLimb.rotation %= box2d.b2_two_pi;
            }
            this.state = XG.Ks.ball_throwUnready;
            this.canTouchOtherBalls = false;
            this.vsX = [];
            this.vsY = [];
        };
        MC_UpdateBall.prototype.updateBallRelease = function () {
            var ball = this.ball;
            ball.onForce.remove(this.handleForceReleaseBall, this);
            ball.isHeld = false;
            // stop holding onto ball by destroying hand-ball joints
            for (var _i = 0, _a = this.jsHand2Ball; _i < _a.length; _i++) {
                var j = _a[_i];
                XG.Gm.ie.b2d.world.DestroyJoint(j);
            }
            this.jsHand2Ball = [];
            this.ball = null;
            this.state = null;
            this.canTouchOtherBalls = true;
        };
        MC_UpdateBall.prototype.updateBallSetThrowReady = function () {
            var target = this.target;
            /** throwing arm */
            var bArm = this.entity.gsLimbFront.gHumerus.body;
            // distance from shoulder to input
            var distShoulder2Target = Phaser.Math.distance(bArm.x, bArm.y, target.x, target.y);
            this.state = (distShoulder2Target < XG.MCConstruct.lArmHand)
                ? XG.Ks.ball_throwReady
                : XG.Ks.ball_throwUnready;
        };
        MC_UpdateBall.prototype.updateBallTryThrow = function () {
            var target = this.target;
            var gsLimb = this.entity.gsLimbFront;
            /** throwing arm */
            var bArm = gsLimb.gHumerus.body, lArm = XG.MCConstruct.lArmHand;
            // ensure arm extended into throw
            /** distance from shoulder to input */
            var distShoulder2Target = Phaser.Math.distance(bArm.x, bArm.y, target.x, target.y);
            if (distShoulder2Target < lArm) {
                return;
            }
            // prevent accidental release when aiming away from hoop
            //
            // NOTE: this prevents player from throwing ball downward
            // if player is holding ball below hoop level
            var bChest = this.entity.gChest.body, isAimingAway = this.ball.g.body.y > XG.Hoop.Y
                && (target.y > bChest.y || target.y > target.yPrev);
            if (isAimingAway) {
                this.state = XG.Ks.ball_throwUnready;
                this.vsX = [];
                this.vsY = [];
                return;
            }
            // ensure throw occurs during arm extension phase
            var bHand = gsLimb.gHand.body;
            // distance from shoulder to hand
            var distShoulder2Hand = Phaser.Math.distance(bArm.x, bArm.y, bHand.x, bHand.y);
            // distance from shoulder past which determines throw
            var distShoulder2Throw = lArm / XG.Consts.PHI;
            if (distShoulder2Hand > distShoulder2Throw) {
                this.updateBallThrow();
            }
        };
        MC_UpdateBall.prototype.updateBallThrow = function () {
            // calculate throw velocity as average of recent hand velocities
            var vsX = this.vsX, vX = 0, vsY = this.vsY, vY = 0;
            for (var i = 0; i < vsX.length; i++) {
                vX += vsX[i];
                vY += vsY[i];
            }
            // throw velocity leverages input velocity
            var target = this.target;
            vX += target.x - target.xPrev;
            vY += target.y - target.yPrev;
            // throw velocity is smoothed using average
            var numVs = vsX.length + 1;
            vX /= numVs;
            vY /= numVs;
            // set ball velocity
            var vBall = this.ball.g.body.velocity;
            vBall.x = vX;
            vBall.y = vY;
            this.updateBallRelease();
        };
        MC_UpdateBall.prototype.updateBallTrackVelocity = function () {
            var vHandFront = this.entity.gsLimbFront.gHand.body.velocity, vsX = this.vsX, vsY = this.vsY;
            vsX.push(vHandFront.x);
            vsY.push(vHandFront.y);
            // only track specified number of velocities
            var numVs = this.numVs;
            if (vsX.length > numVs) {
                this.vsX = vsX.slice(vsX.length - numVs, vsX.length);
                this.vsY = vsY.slice(vsY.length - numVs, vsY.length);
            }
        };
        return MC_UpdateBall;
    }(XG.A_));
    XG.MC_UpdateBall = MC_UpdateBall;
    var MC_UpdateBodies = /** @class */ (function (_super) {
        __extends(MC_UpdateBodies, _super);
        function MC_UpdateBodies() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isTrackingArm = true;
            return _this;
        }
        MC_UpdateBodies.prototype.constructThis = function () {
            this.entity.onBeginContact.add(this.handleBeginContact, this);
            this.entity.onUpdate.add(this.updateLimbs, this);
        };
        MC_UpdateBodies.prototype.handleBeginContact = function (_fThis, fThat) {
            var categThat = fThat.GetFilterData().categoryBits;
            if (categThat == XG.Collision.HOOP && !fThat.IsSensor()) {
                this.handleBeginContactHoop();
            }
        };
        MC_UpdateBodies.prototype.handleBeginContactHoop = function () {
            // upon touching hoop's rim, temporarily let arms go limp
            // to prevent clipping through rim at elbow, wrist joints
            this.isTrackingArm = false;
            XG.Gm.ie.time.events.add(777, this.resetIsTrackingArm, this);
        };
        MC_UpdateBodies.prototype.resetIsTrackingArm = function () {
            this.isTrackingArm = true;
        };
        MC_UpdateBodies.prototype.updateLimbs = function () {
            this.updateTorso();
            this.updateArms();
        };
        /** pull head to look up or down, depending on y of input */
        MC_UpdateBodies.prototype.updateTorso = function () {
            var mc = this.entity;
            var bHead = mc.gHead.body, bs = [bHead, mc.gChest.body, mc.gGut.body];
            var target = XG.Gm.ie.input;
            // prevent MC from bending backwards
            var xHip = mc.gHip.body.x;
            for (var _i = 0, bs_3 = bs; _i < bs_3.length; _i++) {
                var b = bs_3[_i];
                // look up or down based on input y relative to body
                var dy = target.y - b.y, fy = Phaser.Math.clamp(dy, -b.mass, b.mass);
                // correct excessive bending over
                var isBendingBack = b.angularVelocity < 0, isBentBack = b.x < xHip, isOverBending = isBendingBack == isBentBack;
                if (isOverBending) {
                    b.angularVelocity *= 0.75;
                    fy = -Math.abs(fy);
                }
                b.applyForce(0, fy);
            }
        };
        /** pull arms toward input position */
        MC_UpdateBodies.prototype.updateArms = function () {
            if (!this.isTrackingArm) {
                return;
            }
            var lArm = XG.MCConstruct.lArmHand;
            // give arms a slight lag when tracking
            var scaleV = XG.Gm.ie.time.fps * 0.39;
            // where to extend hands
            var to = XG.Gm.ie.input;
            for (var _i = 0, _a = this.entity.gsLimbs; _i < _a.length; _i++) {
                var gsLimb = _a[_i];
                var bArm = gsLimb.gHumerus.body, bHand = gsLimb.gHand.body;
                // direction from shoulder to input
                var dA2I = new Phaser.Point(to.x - bArm.x, to.y - bArm.y);
                // do not extend arm beyond arm length
                dA2I.setMagnitude(Math.min(lArm, dA2I.getMagnitude()));
                // direction of hand to movement
                var dxH = bArm.x + dA2I.x - bHand.x, dyH = bArm.y + dA2I.y - bHand.y;
                bHand.velocity.x = dxH * scaleV;
                bHand.velocity.y = dyH * scaleV;
            }
        };
        return MC_UpdateBodies;
    }(XG.A_));
    XG.MC_UpdateBodies = MC_UpdateBodies;
    var MC_WalkCycle = /** @class */ (function (_super) {
        __extends(MC_WalkCycle, _super);
        function MC_WalkCycle() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.iStep = 0;
            return _this;
        }
        Object.defineProperty(MC_WalkCycle.prototype, "dxStep", {
            get: function () {
                return Math.PI * this.entity.locomotor.rMotor;
            },
            enumerable: true,
            configurable: true
        });
        MC_WalkCycle.prototype.constructThis = function () {
            this.entity.onBeginContact.add(this.handleBeginContact, this);
            this.entity.onEndContact.add(this.handleEndContact, this);
        };
        MC_WalkCycle.prototype.handleBeginContact = function (fThis, _fThat) {
            if (fThis[XG.Ks.k] === XG.Ks.fLomoStep) {
                this.handleBeginContactStepLomo();
            }
        };
        MC_WalkCycle.prototype.handleBeginContactStepLomo = function () {
            var mc = this.entity;
            var lomo = mc.locomotor, bLomo = lomo.bMotor, rLomo = XG.MCConstruct.hlLeg;
            var signDx = (lomo.jMotor.m_motorSpeed > 0) ? 1 : -1, dxStep = signDx * this.dxStep;
            // set leg going up
            var iU = this.iStep;
            var gsLegU = mc.gsLimbs[iU], bFemurU = gsLegU.gFemur.body, bTibiaU = gsLegU.gTibia.body, bFootU = gsLegU.gFoot.body;
            if (signDx > 0) { // forward
                this.setVToRotation(bFemurU, -Math.PI / 3);
                this.setVToRotation(bTibiaU, 0);
            }
            else {
                this.setVToRotation(bFemurU, 0);
                this.setVToRotation(bTibiaU, Math.PI / 4);
            }
            this.setVToX(bFootU, bFemurU.x + dxStep);
            this.setVToY(bFootU, bLomo.y + bLomo.velocity.y);
            // set leg going down
            var iD = (iU + 1) % 2;
            var gsLegD = mc.gsLimbs[iD], bFemurD = gsLegD.gFemur.body, bTibiaD = gsLegD.gTibia.body, bFootD = gsLegD.gFoot.body;
            this.setVToRotation(bTibiaD, 0);
            this.setVToRotation(bFootD, 0);
            this.setVToX(bFootD, bFemurD.x);
            this.setVToY(bFootD, bLomo.y + rLomo + bLomo.velocity.y);
            this.iStep = iD;
            if (XG.Gm.isDebugging) {
                gsLegU.gFemur.tint = gsLegU.gFoot.tint = XG.Color.GREEN;
                gsLegD.gFemur.tint = gsLegD.gFoot.tint = XG.Color.RED;
            }
        };
        MC_WalkCycle.prototype.handleEndContact = function (fThis, _fThat) {
            if (fThis[XG.Ks.k] === XG.Ks.fFoot) {
                this.handleEndContactStepFoot();
            }
        };
        MC_WalkCycle.prototype.handleEndContactStepFoot = function () {
            var mc = this.entity;
            var bs = [
                mc.gHead.body, mc.gChest.body, mc.gGut.body, mc.locomotor.bSeat
            ];
            for (var _i = 0, bs_4 = bs; _i < bs_4.length; _i++) {
                var b = bs_4[_i];
                // var forceStep: number = -16 * b.mass;
                // b.applyForce(0, forceStep);
                b.velocity.y -= 69;
            }
        };
        /** TODO: learn why this appears to mostly work */
        MC_WalkCycle.prototype.getScaleV = function () {
            var lomo = this.entity.locomotor, speedLomoR = lomo.jMotor.m_motorSpeed, speedLomoRAbs = Math.abs(speedLomoR);
            return speedLomoRAbs;
        };
        MC_WalkCycle.prototype.getScaleVR = function () {
            //			return this.entity.locomotor.rpsMotor;
            return this.getScaleV();
        };
        MC_WalkCycle.prototype.setVToRotation = function (b, rotationTo, _time) {
            if (_time === void 0) { _time = 1; }
            var dRotation = rotationTo - b.rotation;
            var vRotation = this.getScaleVR() * dRotation;
            b.angularVelocity = vRotation;
        };
        MC_WalkCycle.prototype.setVToX = function (b, xTo, _time) {
            if (_time === void 0) { _time = 1; }
            var dX = xTo - b.x;
            var vX = this.getScaleV() * dX;
            b.velocity.x = vX;
        };
        MC_WalkCycle.prototype.setVToY = function (b, yTo, _time) {
            if (_time === void 0) { _time = 1; }
            var dY = yTo - b.y;
            var vY = this.getScaleV() * dY;
            b.velocity.y = vY;
        };
        return MC_WalkCycle;
    }(XG.A_));
    XG.MC_WalkCycle = MC_WalkCycle;
})(XG || (XG = {}));
// Managers
var XG;
(function (XG) {
    /*
    NOTE: copy-paste because Typescript interfaces cannot have static members
    {
        private static _ie: ;
        static get ie():  { return ._ie; }
        static init(): void { ._ie = ._ie || new (); }

        private constructor() {
        }
    }
    */
    /**
     * cookie manager, for saving game data
     * @see https://www.w3schools.com/js/js_cookies.asp
     */
    var MrCookie = /** @class */ (function () {
        function MrCookie() {
        }
        Object.defineProperty(MrCookie, "ie", {
            get: function () { return MrCookie._ie; },
            enumerable: true,
            configurable: true
        });
        MrCookie.init = function () { MrCookie._ie = MrCookie._ie || new MrCookie(); };
        MrCookie.prototype.getCookie = function (k) {
            var k_ = k + '=';
            var entriesCookie = document.cookie.split(';');
            for (var _i = 0, entriesCookie_1 = entriesCookie; _i < entriesCookie_1.length; _i++) {
                var entry = entriesCookie_1[_i];
                while (entry.charAt(0) == ' ') {
                    entry = entry.substring(1);
                }
                if (entry.indexOf(k_) == 0) {
                    return entry.substring(k_.length, entry.length);
                }
            }
            return undefined;
        };
        MrCookie.prototype.getCookieBool = function (k, vDefault) {
            var vStr = this.getCookie(k);
            return (XG.GmH.isUndefined(vStr))
                ? vDefault
                : (vStr === 'true');
        };
        MrCookie.prototype.getCookieNum = function (k, vDefault) {
            var vStr = this.getCookie(k);
            var v = Number(vStr);
            return (isNaN(v))
                ? vDefault
                : v;
        };
        MrCookie.prototype.setCookie = function (k, v) {
            document.cookie = k + '=' + v + ';'; // 'path=/'; //
        };
        return MrCookie;
    }());
    XG.MrCookie = MrCookie;
    var MrInput = /** @class */ (function () {
        function MrInput() {
            this.constructThisDisableEventInputDefault();
            XG.Gm.ie.input.maxPointers = 1;
            XG.Gm.ie.onUpdate.add(this.update, this);
        }
        Object.defineProperty(MrInput, "ie", {
            get: function () { return MrInput._ie; },
            enumerable: true,
            configurable: true
        });
        MrInput.init = function () { MrInput._ie = MrInput._ie || new MrInput(); };
        Object.defineProperty(MrInput.prototype, "dyPerSecond", {
            get: function () {
                // if input's rising speed is above a threshold in pixels per second
                return (this.y - this.yPrev) * XG.Gm.ie.time.fps;
            },
            enumerable: true,
            configurable: true
        });
        /** disable right click dropdown, mouse wheel scroll */
        MrInput.prototype.constructThisDisableEventInputDefault = function () {
            var fnPreventDefaultInputEvent = function (ev) {
                ev.preventDefault();
            };
            window.oncontextmenu = fnPreventDefaultInputEvent;
            window.onmousewheel = fnPreventDefaultInputEvent;
        };
        MrInput.prototype.update = function () {
            var input = XG.Gm.ie.input;
            this.xPrev = this.x;
            this.x = input.x;
            this.yPrev = this.y;
            this.y = input.y;
        };
        return MrInput;
    }());
    XG.MrInput = MrInput;
    var MrSettings = /** @class */ (function () {
        function MrSettings() {
            this._onSet = new Phaser.Signal();
            this.settings = {};
            this.signals = {};
            this.constructSetting(XG.Ks.sound, true);
            this.constructSetting(XG.Ks.gravitySpike, true);
            // write setting changes to cookies
            var mrCookie = MrCookie.ie;
            this.onSet.add(mrCookie.setCookie, mrCookie);
        }
        Object.defineProperty(MrSettings, "ie", {
            get: function () { return MrSettings._ie; },
            enumerable: true,
            configurable: true
        });
        MrSettings.init = function () {
            MrSettings._ie = MrSettings._ie || new MrSettings();
        };
        Object.defineProperty(MrSettings, "X0_MC", {
            get: function () { return 222; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrSettings, "Y0_MC", {
            get: function () { return XG.Gm.ie.height / 2 + 111; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrSettings.prototype, "onSet", {
            /** dispatch(isOn: boolean) */
            get: function () { return this._onSet; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrSettings.prototype, "onSetGravitySpike", {
            /** dispatch(isOn: boolean) */
            get: function () { return this.signals[XG.Ks.gravitySpike]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrSettings.prototype, "onSetSound", {
            /** dispatch(isOn: boolean) */
            get: function () { return this.signals[XG.Ks.sound]; },
            enumerable: true,
            configurable: true
        });
        MrSettings.prototype.constructSetting = function (k, vDefault) {
            // if setting doesn't exist in cookies, set to default value
            var v = MrCookie.ie.getCookieBool(k, vDefault);
            this.settings[k] = v;
            // set signal
            this.signals[k] = new Phaser.Signal();
        };
        MrSettings.prototype.getKs = function () {
            return XG.GmH.getKs(this.settings);
        };
        MrSettings.prototype.getV = function (k) { return this.settings[k]; };
        MrSettings.prototype.setV = function (k, v) {
            this.settings[k] = v;
            this.signals[k].dispatch(v);
            this.onSet.dispatch(k, v);
        };
        MrSettings.SECONDS_PER_GAME = 120;
        MrSettings.SECONDS_PER_SCORE = 2;
        return MrSettings;
    }());
    XG.MrSettings = MrSettings;
    var MrSound = /** @class */ (function () {
        function MrSound() {
            this.setIsOn(MrSettings.ie.getV(XG.Ks.sound));
            MrSettings.ie.onSetSound.add(this.setIsOn, this);
        }
        Object.defineProperty(MrSound, "ie", {
            get: function () { return MrSound._ie; },
            enumerable: true,
            configurable: true
        });
        MrSound.init = function () { MrSound._ie = MrSound._ie || new MrSound(); };
        MrSound.prototype.getIsOn = function () {
            return !XG.Gm.ie.sound.mute;
        };
        MrSound.prototype.setIsOn = function (v) {
            XG.Gm.ie.sound.mute = !v;
        };
        return MrSound;
    }());
    XG.MrSound = MrSound;
    var MrStage = /** @class */ (function () {
        function MrStage() {
            this.constructGroups();
            this.constructParticles();
            XG.Gm.ie.onUpdate.addOnce(this.constructObjects, this);
        }
        Object.defineProperty(MrStage, "ie", {
            get: function () { return MrStage._ie; },
            enumerable: true,
            configurable: true
        });
        MrStage.init = function () { MrStage._ie = MrStage._ie || new MrStage(); };
        /** create groups from bottom to top */
        MrStage.prototype.constructGroups = function () {
            var gmAdd = XG.Gm.ie.add;
            this.groupBG = gmAdd.group();
            this.groupScoreboard = gmAdd.group();
            this.groupMCBack = gmAdd.group();
            this.groupMCMiddle = gmAdd.group();
            this.groupMCFront = gmAdd.group();
            this.groupBall = gmAdd.group();
            this.groupHoopGround = gmAdd.group();
            this.groupEffects = gmAdd.group();
            this.groupUI = gmAdd.group();
        };
        /** create particle effects in cache */
        MrStage.prototype.constructParticles = function () {
            var radius = 8;
            var diam = 2 * radius;
            var colors = [
                XG.Color.WHITE,
                XG.Color.BALL_FC, XG.Color.BALL_GS,
                XG.Color.BALL_WM_GREEN, XG.Color.BALL_WM_RED
            ];
            for (var _i = 0, colors_1 = colors; _i < colors_1.length; _i++) {
                var color = colors_1[_i];
                var fillStyle = Phaser.Color.RGBtoString(0xff & (color >> 16), // r
                0xff & (color >> 8), // g
                0xff & (color) // b
                );
                var bmd = XG.Gm.ie.make.bitmapData(diam, diam);
                bmd.circle(radius, radius, radius, fillStyle);
                var k = XG.Ks.particle + color;
                XG.Gm.ie.cache.addBitmapData(k, bmd);
            }
        };
        MrStage.prototype.constructObjects = function () {
            // create balls at center
            var dxBall = 2 * XG.Ball.DIAMETER;
            var xBall = XG.Gm.ie.width / 2 - dxBall, yBall = XG.Gm.ie.height / 2;
            var ksBalls = [XG.Ks.ballFC, XG.Ks.ballGS, XG.Ks.ballWM];
            var balls = {};
            for (var _i = 0, ksBalls_1 = ksBalls; _i < ksBalls_1.length; _i++) {
                var k = ksBalls_1[_i];
                balls[k] = new XG.Ball(xBall, yBall, k);
                xBall += dxBall;
            }
            ;
            this.balls = balls;
            this.cloud = new XG.Cloud();
            this.bg = new XG.BG();
            this.effectsText = new XG.EffectsText();
            this.fence = new XG.Fence();
            this.ground = new XG.Ground();
            this.hoop = new XG.Hoop();
            this.mc = new XG.MC();
            this.scoreboard = new XG.Scoreboard();
            this.ui = new XG.UI();
        };
        return MrStage;
    }());
    XG.MrStage = MrStage;
    var MrTierBonus = /** @class */ (function () {
        function MrTierBonus() {
        }
        Object.defineProperty(MrTierBonus, "ie", {
            get: function () { return MrTierBonus._ie; },
            enumerable: true,
            configurable: true
        });
        MrTierBonus.init = function () {
            MrTierBonus._ie = MrTierBonus._ie || new MrTierBonus();
        };
        MrTierBonus.getITierAt = function (score, isSpiked) {
            for (var _i = 0, _a = MrTierBonus.Tiers; _i < _a.length; _i++) {
                var tier = _a[_i];
                if (score >= tier.scoreUpperLimit) {
                    continue;
                }
                return (!(tier.isLockedByGravitySpike && isSpiked))
                    ? tier.i
                    : tier.i - 1;
            }
        };
        Object.defineProperty(MrTierBonus.prototype, "isTierGoldAchieved", {
            /** if current high score tier is at least Gold */
            get: function () {
                var tierSilver = MrTierBonus.Tiers[2], scoreUpperLimitSilver = tierSilver.scoreUpperLimit;
                return MrVsGm.ie.vHiScore >= scoreUpperLimitSilver;
            },
            enumerable: true,
            configurable: true
        });
        MrTierBonus.scaleDifficulty = 7; // 1; //
        MrTierBonus.Tiers = [
            {
                i: 0, colors: [XG.Color.BLACK, XG.Color.GRAY_DARK],
                kGHead: XG.Ks.mcHead, kSound: XG.Ks.none,
                scoreUpperLimit: 1 * MrTierBonus.scaleDifficulty, value: 0
            }, {
                i: 1, colors: [XG.Color.BRONZE, XG.Color.BRONZE_DARK, XG.Color.WHITE],
                kGHead: XG.Ks.mcHeadBronze, kSound: XG.Ks.tierBonusBronze,
                scoreUpperLimit: 2 * MrTierBonus.scaleDifficulty, value: 1
            }, {
                i: 2, colors: [XG.Color.GRAY_MID, XG.Color.GRAY_DARK, XG.Color.WHITE],
                kGHead: XG.Ks.mcHeadSilver, kSound: XG.Ks.tierBonusSilver,
                scoreUpperLimit: 3 * MrTierBonus.scaleDifficulty, value: 2
            }, {
                i: 3, colors: [XG.Color.YELLOW, XG.Color.ORANGE, XG.Color.WHITE],
                kGHead: XG.Ks.mcHeadGold, kSound: XG.Ks.tierBonusGold,
                scoreUpperLimit: 6 * MrTierBonus.scaleDifficulty, value: 4
            }, {
                i: 4, colors: [XG.Color.TYRIAN, XG.Color.TYRIAN_DARK, XG.Color.WHITE],
                kGHead: XG.Ks.mcHeadTyrian, kSound: XG.Ks.tierBonusTyrian,
                scoreUpperLimit: 7 * MrTierBonus.scaleDifficulty, value: 16
            }, {
                i: 5,
                isLockedByGravitySpike: true,
                colors: [XG.Color.CYAN, XG.Color.PINK, XG.Color.YELLOW, XG.Color.WHITE],
                kGHead: XG.Ks.mcHeadBling, kSound: XG.Ks.tierBonusBling,
                scoreUpperLimit: Number.POSITIVE_INFINITY, value: 32,
            }
        ];
        return MrTierBonus;
    }());
    XG.MrTierBonus = MrTierBonus;
    var MrVsGm = /** @class */ (function () {
        function MrVsGm() {
            this._onHiTierChange = new Phaser.Signal();
            this._onTierChange = new Phaser.Signal();
            this._onStateChange = new Phaser.Signal();
            this._onHiScoreChange = new Phaser.Signal();
            this._onScoreChange = new Phaser.Signal();
            this._onTimeAdd = new Phaser.Signal();
            this._onTimeChange = new Phaser.Signal();
            this.isStarted = this._isSpiked = false;
            this.iTier = this.vScore = this.vTime = 0;
            this.iHiTier = MrCookie.ie.getCookieNum(XG.Ks.hiTier, 0);
            this.vHiScore = MrCookie.ie.getCookieNum(XG.Ks.hiScore, 0);
            XG.Gm.ie.onGravitySpike.add(this.setIsSpiked, this);
        }
        Object.defineProperty(MrVsGm, "ie", {
            get: function () { return MrVsGm._ie; },
            enumerable: true,
            configurable: true
        });
        MrVsGm.init = function () { MrVsGm._ie = MrVsGm._ie || new MrVsGm(); };
        Object.defineProperty(MrVsGm.prototype, "onHiTierChange", {
            // signals
            // signals: tier
            /** dispatch(iTier: number) */
            get: function () { return this._onHiTierChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "onTierChange", {
            /** dispatch(iTier: number) */
            get: function () { return this._onTierChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "onStateChange", {
            // signals: state
            /** dispatch(isStarted: boolean) */
            get: function () { return this._onStateChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "onHiScoreChange", {
            // signals: scoreboard
            /** dispatch(v: number) */
            get: function () { return this._onHiScoreChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "onScoreChange", {
            /** dispatch(v: number) */
            get: function () { return this._onScoreChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "onTimeAdd", {
            /** dispatch(dtime: number) */
            get: function () { return this._onTimeAdd; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "onTimeChange", {
            /** dispatch(v: number) */
            get: function () { return this._onTimeChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "isStarted", {
            get: function () { return this._isStarted; },
            set: function (v) {
                if (v == this._isStarted) {
                    return;
                }
                if (v) {
                    this._isSpiked = false;
                    this.vScore = 0;
                }
                this._isStarted = v;
                this.onStateChange.dispatch(v);
            },
            enumerable: true,
            configurable: true
        });
        MrVsGm.prototype.setIsSpiked = function () {
            this._isSpiked = true;
        };
        Object.defineProperty(MrVsGm.prototype, "iHiTier", {
            // tier
            /** highest bonus tier attained across all game sessions */
            get: function () { return this._iHiTier; },
            set: function (v) {
                this._iHiTier = v;
                this.onHiTierChange.dispatch(v);
                MrCookie.ie.setCookie(XG.Ks.hiTier, v);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "iTier", {
            /** highest bonus tier attained in current game session */
            get: function () { return this._iTier; },
            set: function (v) {
                this._iTier = v;
                this.onTierChange.dispatch(v);
                if (v > this.iHiTier) {
                    this.iHiTier = v;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "vHiScore", {
            // scoreboard
            get: function () { return this._vHiScore; },
            set: function (v) {
                this._vHiScore = v;
                this.onHiScoreChange.dispatch(v);
                MrCookie.ie.setCookie(XG.Ks.hiScore, v);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "vScore", {
            get: function () { return this._vScore; },
            set: function (v) {
                this._vScore = v;
                this.onScoreChange.dispatch(v);
                if (v > this.vHiScore) {
                    this.vHiScore = v;
                }
                var isSpiked = this._isSpiked;
                var iTierGame = this.iTier, iTierCurrent = MrTierBonus.getITierAt(v, isSpiked);
                if (iTierCurrent > iTierGame) {
                    this.iTier = iTierCurrent;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MrVsGm.prototype, "vTime", {
            get: function () { return this._vTime; },
            set: function (v) {
                this._vTime = v;
                this.onTimeChange.dispatch(v);
            },
            enumerable: true,
            configurable: true
        });
        MrVsGm.prototype.addVTime = function (d) {
            this.vTime += d;
            this.onTimeAdd.dispatch(d);
        };
        return MrVsGm;
    }());
    XG.MrVsGm = MrVsGm;
})(XG || (XG = {}));
// Stage Elements
// Hoop
// Score
// Timer
var XG;
(function (XG) {
    var BG = /** @class */ (function () {
        function BG() {
            var gm = XG.Gm.ie;
            var g = gm.add.sprite(0, 0, XG.Ks.bg, null, XG.MrStage.ie.groupBG);
            g.anchor.x = 0.5;
            g.anchor.y = 1;
            g.x = 0.5 * gm.width;
            g.y = 0.82 * gm.height;
        }
        return BG;
    }());
    XG.BG = BG;
    /** a cloud that periodically floats across background */
    var Cloud = /** @class */ (function () {
        function Cloud() {
            var gm = XG.Gm.ie;
            var g = gm.add.sprite(2000, 0, XG.Ks.cloud, null, XG.MrStage.ie.groupBG);
            g.rotation = 0.1;
            // cloud floats leftward in 1 minute
            var propertiesTwX = { x: -1000 }, twX = gm.add.tween(g);
            twX.to(propertiesTwX, 60000, Phaser.Easing.Linear.None);
            twX.start();
            twX.repeat(-1);
            // cloud subtly bobs up and down
            var propertiesTwYRotation = { y: 10, rotation: 0.05 }, easingTwyRotation = Phaser.Easing.Sinusoidal.InOut, twYRotation = gm.add.tween(g);
            twYRotation.to(propertiesTwYRotation, 6000, easingTwyRotation);
            twYRotation.start();
            twYRotation.repeat(-1);
            twYRotation.yoyo(true);
        }
        return Cloud;
    }());
    XG.Cloud = Cloud;
    /** responsible for handling all text effects on screen */
    var EffectsText = /** @class */ (function () {
        function EffectsText() {
            this.constructEffectGameReady();
            this.constructListenSignals();
        }
        EffectsText.prototype.constructEffectGameReady = function () {
            var x = XG.Gm.ie.width / 2, y = XG.Gm.ie.height / 2;
            new XG.EffectText(x, y, 'FREE FRO', { size: 100 }, { duration: 5000 });
            new XG.EffectText(x, y + 150, 'by XJ', { font: XG.Ks.font1, size: 72 }, { duration: 5000 });
            new XG.EffectText(x, y + 300, XG.Text.VERB_INPUT + ' fo instructions', { font: XG.Ks.font1, size: 42 }, { duration: 7000 });
        };
        EffectsText.prototype.constructListenSignals = function () {
            XG.Gm.ie.onInputDown.add(this.effectTextDirections, this);
            var balls = XG.MrStage.ie.balls;
            for (var k in balls) {
                var ball = balls[k];
                ball.onScore.add(this.effectTextScore, this, 0, ball);
            }
            var mrVsGm = XG.MrVsGm.ie;
            mrVsGm.onStateChange.add(this.effectTextGameStateChange, this);
            mrVsGm.onTimeAdd.add(this.effectTextTimeAdded, this);
            XG.MrSettings.ie.onSet.add(this.effectTextSetting, this);
        };
        /** show game directions if game is not in play */
        EffectsText.prototype.effectTextDirections = function () {
            if (XG.MrVsGm.ie.isStarted) {
                return;
            }
            var nounInput = XG.Text.NOUN_INPUT, verbInput = XG.Text.VERB_INPUT;
            var directions = "\n\t\t\t\tYo run n jump inna direction of yo " + nounInput + ".\n\n\t\t\t\tYo finna fro yo BALLS inna HOOP.\n\t\t\t\t(1) Grab on yo balls.\n\t\t\t\t(2) Put yo " + nounInput + " on yo ball to ready yo fro.\n\t\t\t\t(3) Swish yo " + nounInput + " inna direction yo finna fro.\n\t\t\t\t(4) When yo balls inna air, " + verbInput + " to drop yo balls mo.\n\n\t\t\t\tYO BALLS BE UNIQUE.\n\t\t\t";
            new XG.EffectText(XG.Gm.ie.width / 2, XG.Gm.ie.height / 2, directions, { font: XG.Ks.font1, size: 48 }, { duration: 5000, offsetY: 0.01 });
        };
        EffectsText.prototype.effectTextGameStateChange = function (isStarted) {
            var text = (isStarted) ? 'GAME ON' : 'GAME OVER';
            new XG.EffectText(XG.Gm.ie.width / 2, XG.Gm.ie.height / 2, text, { font: XG.Ks.font1, size: 100 });
        };
        EffectsText.prototype.effectTextScore = function (ball) {
            new XG.EffectText(XG.Gm.ie.width / 2, XG.Gm.ie.height / 2, 'SCORE!', { font: XG.Ks.font1, size: 64, tint: ball.color });
        };
        EffectsText.prototype.effectTextTimeAdded = function (dtime) {
            new XG.EffectText(XG.Gm.ie.width / 2, XG.Gm.ie.height / 2 + 64, '+' + dtime + ' seconds', { size: 48 });
            // vibrate screen proportionate to time bonus
            XG.Gm.ie.camera.shake(dtime * 0.0001, 1000);
        };
        EffectsText.prototype.effectTextSetting = function (k, isOn) {
            var textOn = (isOn) ? ' ON' : ' OFF', text = k.toUpperCase() + textOn, tint = (isOn) ? XG.Color.YELLOW : XG.Color.GRAY_MID;
            new XG.EffectText(XG.Gm.ie.width / 2, XG.Gm.ie.height / 2, text, { font: XG.Ks.font1, size: 100, tint: tint }, { duration: 2000 });
        };
        return EffectsText;
    }());
    XG.EffectsText = EffectsText;
    /** invisible chain link fence bounded by left and right sides of screen */
    var Fence = /** @class */ (function () {
        function Fence() {
            var gm = XG.Gm.ie;
            var wBoundary = 100;
            var b = new Phaser.Physics.Box2D.Body(gm, null);
            var offsetsX = [
                -wBoundary / 2,
                wBoundary / 2 + gm.width // right boundary
            ];
            for (var _i = 0, offsetsX_1 = offsetsX; _i < offsetsX_1.length; _i++) {
                var offsetX = offsetsX_1[_i];
                var f = b.addRectangle(wBoundary, 100000, offsetX);
                f.SetUserData(this);
            }
            b.static = true;
            b.setCollisionCategory(XG.Collision.FENCE);
        }
        Fence.prototype.handleBeginContact = function (_fThis, fThat) {
            if (fThat.IsSensor()) {
                return;
            }
            // minor body parts don't make noise
            var categThat = fThat.GetFilterData().categoryBits;
            if (categThat & XG.Collision.MC_HAND
                || categThat & XG.Collision.MC_LIMB) {
                return;
            }
            XG.Gm.ie.sound.play(XG.Ks.fenceHit);
        };
        return Fence;
    }());
    XG.Fence = Fence;
    var Ground = /** @class */ (function () {
        function Ground() {
            var gm = XG.Gm.ie;
            var g = gm.add.sprite(gm.width / 2, 1.5 * gm.height, XG.Ks.ground, undefined, XG.MrStage.ie.groupHoopGround);
            gm.b2d.enable(g);
            g.body.friction = 1;
            g.body.static = true;
            g.body.setCollisionCategory(XG.Collision.GROUND);
            this.g = g;
        }
        return Ground;
    }());
    XG.Ground = Ground;
    var Hoop = /** @class */ (function () {
        /** distance between rim's outer edges; end-to-end diameter of hoop */
        // private get wHoopOuter(): number {
        // 	return 4 * this.rRim + this.wHoopInner;
        // }
        function Hoop() {
            /** keep track of balls that may score from above hoop */
            this.ksBallsScorable = {};
            var gm = XG.Gm.ie;
            var g = gm.add.sprite(1200, Hoop.Y, XG.Ks.hoop, undefined, XG.MrStage.ie.groupHoopGround);
            this.g = g;
            var b = XG.GmPhysics.enable(g);
            var rRim = this.rRim;
            var wHoopInner = this.wHoopInner;
            // hoop rim fixture
            var oxRim = wHoopInner / 2 + rRim;
            for (var i = 0; i < 2; i++) {
                oxRim = (i > 0) ? -oxRim : oxRim;
                var fRim = b.addCircle(rRim, oxRim, 0);
                fRim.SetUserData(this);
            }
            /**
             * @description
             * This tall triangular sensor detects a faster-falling ball
             * which would clip undetected through a thinner sensor.
             * It also denies the player from scoring by tossing the ball
             * up through the hoop from directly underneath.
             */
            var fSensor = b.addPolygon([
                -wHoopInner / 2, 0,
                wHoopInner / 2, 0,
                0, -256
            ]);
            fSensor.SetSensor(true);
            fSensor.SetUserData(this);
            b.bullet = true;
            b.setCollisionCategory(XG.Collision.HOOP);
            // welding hoop's dynamic body to a static point
            // allows hoop to remain mostly rigid,
            // yet give way slightly upon impact
            var bFix = new Phaser.Physics.Box2D.Body(gm, null, gm.width, this.g.y);
            bFix.setCircle(4, 0, 0);
            bFix.static = true;
            XG.Gm.ie.b2d.weldJoint(bFix, b, 0, 0, gm.width - this.g.x, 0);
        }
        Object.defineProperty(Hoop.prototype, "rRim", {
            /** rim radius equals half of rim's thickness */
            get: function () { return 4; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hoop.prototype, "wHoopInner", {
            /** distance between rim's inner edges; space for ball to go through */
            get: function () {
                return Math.ceil(XG.Consts.PHI * XG.Ball.DIAMETER);
            },
            enumerable: true,
            configurable: true
        });
        Hoop.prototype.handleBeginContact = function (fThis, fThat) {
            if (!fThis.IsSensor()) {
                return;
            }
            var ball = fThat.GetUserData();
            if (!(ball instanceof XG.Ball &&
                ball.g.y < this.g.y)) {
                return;
            }
            // ball is above hoop,
            // keep track to see if it falls through
            this.ksBallsScorable[ball.k] = ball;
        };
        Hoop.prototype.handleEndContact = function (fThis, fThat) {
            if (!fThis.IsSensor()) {
                return;
            }
            var ball = fThat.GetUserData();
            if (!(ball instanceof XG.Ball &&
                ball.g.y > this.g.y &&
                this.ksBallsScorable[ball.k])) {
                return;
            }
            // ball has fallen through hoop
            this.score(ball);
        };
        Hoop.prototype.score = function (ball) {
            var mrVsGm = XG.MrVsGm.ie;
            if (mrVsGm.isStarted) {
                XG.MrVsGm.ie.addVTime(ball.timeBonus);
            }
            mrVsGm.vScore++;
            ball.onScore.dispatch();
            var bBall = ball.g.body, vBall = bBall.velocity;
            new XG.EffectBurstScore(bBall.x, Hoop.Y, vBall, ball.k);
            delete this.ksBallsScorable[ball.k];
        };
        Hoop.Y = 200;
        return Hoop;
    }());
    XG.Hoop = Hoop;
    var Scoreboard = /** @class */ (function () {
        function Scoreboard() {
            this.constructTexts();
            this.constructListenSignals();
            this.constructComponent();
        }
        Scoreboard.prototype.constructTexts = function () {
            var gm = XG.Gm.ie, gmAdd = gm.add;
            var groupSboard = XG.MrStage.ie.groupScoreboard;
            var colorLabel = XG.Color.RED;
            var font = XG.Ks.font1;
            var size = 64;
            var xCenter = gm.width / 2, offsetXCenter = 256;
            var yTop = 32, yBottom = 80;
            // score counter
            var xScore = xCenter - offsetXCenter;
            var labelScore = gmAdd.bitmapText(xScore, yTop, font, 'SCORE', size, groupSboard);
            labelScore.tint = colorLabel;
            this.labelScore = labelScore;
            var counterScore = gmAdd.bitmapText(xScore, yBottom, font, '0', size, groupSboard);
            this.counterScore = counterScore;
            // countdown timer
            var countdownTimer = gmAdd.bitmapText(xCenter, yTop + 10, font, '', size, groupSboard);
            this.countdownTimer = countdownTimer;
            var labelTimer = gmAdd.bitmapText(xCenter, yBottom + 20, font, 'TIME REMAINING', size / XG.Consts.PHI, groupSboard);
            labelTimer.tint = colorLabel;
            this.labelTimer = labelTimer;
            // high score counter
            var xHiScore = xCenter + offsetXCenter;
            var labelHiScore = gmAdd.bitmapText(xHiScore, yTop, font, 'HIGH SCORE', size, groupSboard);
            labelHiScore.tint = colorLabel;
            this.labelHiScore = labelHiScore;
            var counterHiScore = gmAdd.bitmapText(xHiScore, yBottom, font, '', size, groupSboard);
            this.counterHiScore = counterHiScore;
            var mrVsGm = XG.MrVsGm.ie;
            this.setCounterHiScore(mrVsGm.vHiScore);
            this.setTintHiScore(mrVsGm.iHiTier);
            for (var _i = 0, _a = [
                labelScore, counterScore,
                labelTimer, countdownTimer,
                labelHiScore, counterHiScore
            ]; _i < _a.length; _i++) {
                var text = _a[_i];
                text.anchor.x = 0.5;
            }
        };
        Scoreboard.prototype.constructListenSignals = function () {
            XG.MrVsGm.ie.onScoreChange.add(this.setCounterScore, this);
            XG.MrVsGm.ie.onHiScoreChange.add(this.setCounterHiScore, this);
            XG.MrVsGm.ie.onHiTierChange.add(this.setTintHiScore, this);
        };
        Scoreboard.prototype.constructComponent = function () {
            this.updateTimer = new Scoreboard_UpdateTimer(this);
        };
        Scoreboard.prototype.setCounterScore = function (v) {
            this.counterScore.text = v.toString();
            if (v > 0) {
                XG.Gm.ie.sound.play(XG.Ks.score);
            }
        };
        Scoreboard.prototype.setCounterHiScore = function (v) {
            this.counterHiScore.text = v.toString();
        };
        Scoreboard.prototype.setTintHiScore = function (iHiTier) {
            var colorHiTier = XG.MrTierBonus.Tiers[iHiTier].colors[0];
            if (colorHiTier != XG.Color.BLACK) {
                this.counterHiScore.tint = colorHiTier;
            }
        };
        return Scoreboard;
    }());
    XG.Scoreboard = Scoreboard;
    var Scoreboard_UpdateTimer = /** @class */ (function (_super) {
        __extends(Scoreboard_UpdateTimer, _super);
        function Scoreboard_UpdateTimer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Scoreboard_UpdateTimer.prototype.constructThis = function () {
            this.reset();
            // when adding time bonus,
            // reset tick to add remainder of unfinished second
            // as an implicit additional time bonus
            XG.MrVsGm.ie.onTimeAdd.add(this.setTickNext, this);
            XG.MrVsGm.ie.onTimeChange.add(this.setCounter, this);
        };
        Scoreboard_UpdateTimer.prototype.reset = function () {
            this.setCounter(0);
            XG.Gm.ie.onBallGrabbed.addOnce(this.start, this);
        };
        Scoreboard_UpdateTimer.prototype.start = function () {
            XG.MrVsGm.ie.isStarted = true;
            XG.MrVsGm.ie.vTime = XG.MrSettings.SECONDS_PER_GAME;
            this.setTickNext();
            XG.Gm.ie.sound.play(XG.Ks.gameOn);
        };
        Scoreboard_UpdateTimer.prototype.stop = function () {
            XG.MrVsGm.ie.isStarted = false;
            if (XG.MrVsGm.ie.vScore > 0) {
                XG.Gm.ie.sound.play(XG.Ks.gameOver);
            }
            else {
                XG.Gm.ie.sound.play(XG.Ks.bruh); // utterance of disappointment
            }
            this.reset();
        };
        Scoreboard_UpdateTimer.prototype.tick = function () {
            var vTime = --XG.MrVsGm.ie.vTime;
            if (vTime <= 0) {
                this.stop();
                return;
            }
            if (vTime <= 10) {
                // 10 second warning ticks
                var kSound = ((vTime % 2) == 0)
                    ? XG.Ks.timeTick
                    : XG.Ks.timeTock;
                XG.Gm.ie.sound.play(kSound);
            }
            this.setTickNext();
        };
        Scoreboard_UpdateTimer.prototype.setTickNext = function () {
            var gmTimer = XG.Gm.ie.time.events;
            gmTimer.remove(this.timerEvent);
            this.timerEvent = gmTimer.add(1000, this.tick, this);
        };
        Scoreboard_UpdateTimer.prototype.setCounter = function (v) {
            var vSeconds = (v % 60).toString(), vMinutes = Math.floor(v / 60).toString();
            this.entity.countdownTimer.text =
                Phaser.Utils.pad(vMinutes, 2, '0', 1)
                    + ' : ' +
                    Phaser.Utils.pad(vSeconds, 2, '0', 1);
        };
        return Scoreboard_UpdateTimer;
    }(XG.A_));
    XG.Scoreboard_UpdateTimer = Scoreboard_UpdateTimer;
    var UI = /** @class */ (function () {
        function UI() {
            this.screenInput = new UI_ScreenInput(this);
            this.buttonsSettings = new UI_ButtonsSettings(this);
        }
        return UI;
    }());
    XG.UI = UI;
    /** screen area that can be clicked or tapped */
    var UI_ScreenInput = /** @class */ (function (_super) {
        __extends(UI_ScreenInput, _super);
        function UI_ScreenInput() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UI_ScreenInput.prototype.constructThis = function () {
            var gm = XG.Gm.ie;
            // use a Graphic to register user input
            var g = gm.add.graphics(0, 0, XG.MrStage.ie.groupUI);
            g.beginFill(XG.Color.BLACK, 0);
            g.drawRect(0, 0, gm.width, gm.height - 2);
            g.inputEnabled = true;
            g.events.onInputDown.add(gm.onInputDown.dispatch, gm.onInputDown);
        };
        return UI_ScreenInput;
    }(XG.A_));
    XG.UI_ScreenInput = UI_ScreenInput;
    var UI_ButtonsSettings = /** @class */ (function (_super) {
        __extends(UI_ButtonsSettings, _super);
        function UI_ButtonsSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UI_ButtonsSettings.prototype.constructThis = function () {
            this.constructThisBtns();
            this.constructThisShowBtnGravitySpike();
        };
        UI_ButtonsSettings.prototype.constructThisBtns = function () {
            var mrSettings = XG.MrSettings.ie;
            // create buttons
            this.btns = {};
            var yBtn = XG.Gm.ie.height;
            var ksSettings = mrSettings.getKs();
            for (var _i = 0, ksSettings_1 = ksSettings; _i < ksSettings_1.length; _i++) {
                var k = ksSettings_1[_i];
                yBtn -= 40;
                this.constructThisBtn(yBtn, k, mrSettings.getV(k));
            }
        };
        UI_ButtonsSettings.prototype.constructThisBtn = function (y, k, v) {
            var gm = XG.Gm.ie, mrSettings = XG.MrSettings.ie;
            var x = 8, font = XG.Ks.font1, size = 35, group = XG.MrStage.ie.groupUI;
            var btn = gm.add.bitmapText(x, y, font, '', size, group);
            btn.inputEnabled = true;
            btn.tint = XG.Color.GRAY_MID;
            btn.events.onInputDown.add(this.updateSetting, this, Number.POSITIVE_INFINITY, k);
            this.btns[k] = btn;
            this.updateSettingTextBtn(k, v);
        };
        UI_ButtonsSettings.prototype.constructThisShowBtnGravitySpike = function () {
            // only allow player to turn off gravity spike
            // after gold tier has been attained
            if (!XG.MrTierBonus.ie.isTierGoldAchieved) {
                this.btns[XG.Ks.gravitySpike].visible = false;
                XG.MrVsGm.ie.onHiScoreChange.add(this.showBtnGravitySpike, this);
            }
        };
        UI_ButtonsSettings.prototype.showBtnGravitySpike = function () {
            if (!XG.MrTierBonus.ie.isTierGoldAchieved) {
                return;
            }
            this.btns[XG.Ks.gravitySpike].visible = true;
            XG.MrVsGm.ie.onHiScoreChange.remove(this.showBtnGravitySpike, this);
        };
        UI_ButtonsSettings.prototype.updateSetting = function (btn, v, k) {
            var mrSettings = XG.MrSettings.ie, isOnCurrent = !mrSettings.getV(k);
            mrSettings.setV(k, isOnCurrent);
            this.updateSettingTextBtn(k, isOnCurrent);
            // play sound effect to notify effect change
            XG.Gm.ie.sound.play(XG.Ks.afroHit);
        };
        UI_ButtonsSettings.prototype.updateSettingTextBtn = function (k, isOn) {
            var btn = this.btns[k];
            // set button's text to inform user:
            // clicking button will set the specified setting to the next one
            var strNextSetting = (isOn) ? ' OFF' : ' ON';
            btn.text = 'SET ' + k.toUpperCase() + strNextSetting;
            // updated width of button text
            // allow button to register clicks in text's whitespace
            var hBtn = btn.height + 5; // 5 pixel BitmapText overflow
            btn.hitArea = new PIXI.Rectangle(0, 0, btn.width, hBtn);
        };
        return UI_ButtonsSettings;
    }(XG.A_));
    XG.UI_ButtonsSettings = UI_ButtonsSettings;
})(XG || (XG = {}));
//# sourceMappingURL=game.js.map