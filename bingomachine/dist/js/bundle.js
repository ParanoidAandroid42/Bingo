var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container(parent, name) {
                var _this = _super.call(this) || this;
                _this._zIndex = 0;
                _this.name = name ? name : null;
                parent && parent.addChild(_this);
                return _this;
            }
            Container.prototype.sortProperties = function () {
                this.children.sort(function (a, b) {
                    a.zIndex = a.zIndex || 0;
                    b.zIndex = b.zIndex || 0;
                    return a.zIndex - b.zIndex;
                });
            };
            Container.prototype.getContainerBounds = function () {
                var bounds = { mostTop: null, mostRight: null, mostBottom: null, mostLeft: null };
                bounds.mostTop = -(this.position.y / this.scale.y);
                bounds.mostRight = ((this.width - this.position.x) / this.scale.x);
                bounds.mostBottom = ((this.height - this.position.y) / this.scale.y);
                bounds.mostLeft = -(this.position.x / this.scale.x);
                return bounds;
            };
            Object.defineProperty(Container.prototype, "angle", {
                get: function () {
                    return Math.round(1 / ((Math.PI / 180) / this.rotation));
                },
                set: function (value) {
                    this.rotation = ((Math.PI / 180) * value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Container.prototype, "zIndex", {
                get: function () {
                    return this._zIndex;
                },
                set: function (value) {
                    this._zIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            return Container;
        }(PIXI.Container));
        Parts.Container = Container;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Components;
    (function (Components) {
        var BrandLogo = (function (_super) {
            __extends(BrandLogo, _super);
            function BrandLogo(game, x, y, autoStart, parent) {
                if (autoStart === void 0) { autoStart = true; }
                var _this = _super.call(this, (parent) ? parent : null, "BrandLogo") || this;
                _this._isStarted = false;
                _this._isLoaded = false;
                _this.position.set(x, y);
                _this.game = game;
                _this._isStarted = autoStart;
                _this.loadAnimationAssets();
                _this.once("removed", function () {
                    _this._animationTween.kill();
                    _this._animationTween = null;
                    _this._spinLabel.destroy(true);
                    _this._maticLabel.destroy();
                    _this._entertainmentLabel.destroy(true);
                }, _this);
                return _this;
            }
            BrandLogo.prototype.play = function () {
                if (this._isLoaded == false)
                    this._isStarted = true;
                else if (this._animationTween.isActive() == false && this._isLoaded == true)
                    this._animationTween.play();
            };
            BrandLogo.prototype.loadAnimationAssets = function () {
                this.game.resource.reset(true, true);
                this.game.resource.addTexture("assets/sprites/brand_logo.json");
                this.game.resource.once("loadcomplete", this.onTextureLoadComplete, this);
                this.game.resource.load();
            };
            BrandLogo.prototype.onTextureLoadComplete = function (asset, resource) {
                var _this = this;
                this._isLoaded = true;
                this.emit("loadcomplete");
                this._spinLabel = new Core.Parts.Sprite(150, 0, "brandlogo/spin", this);
                this._spinLabel.anchor.set(0.5, 0.5);
                this._maticLabel = new Core.Parts.AnimatedSprite(370, -23, Core.Parts.AnimatedSprite.generateTextures("brandlogo/matic/", 0, 53, "", 5), false, 0.5, this);
                this._maticLabel.anchor.set(0.5, 0.5);
                this._entertainmentLabel = new Core.Parts.Sprite(305, 35, "brandlogo/entertainment", this);
                this._entertainmentLabel.anchor.set(0.5, 0.5);
                this._entertainmentLabel.alpha = 0;
                if (window.innerWidth > window.innerHeight) {
                    this._maticLabel.position.set(370, -23);
                    this._spinLabel.position.set(150, 0);
                    this._entertainmentLabel.position.set(305, 35);
                }
                else {
                    this._maticLabel.position.set(100, 228);
                    this._spinLabel.position.set(-120, 250);
                    this._entertainmentLabel.position.set(35, 285);
                }
                this._animationTween = TweenLite.to(this._spinLabel.scale, 0.15, {
                    x: 0.85, y: 0.85, ease: Linear.easeNone, paused: !this._isStarted,
                    onStart: function () {
                        _this.emit("animationstart");
                        _this._spinLabel.tint = 0x696969;
                    },
                    onComplete: function () {
                        TweenLite.to(_this._spinLabel.scale, 0.20, {
                            x: 1, y: 1, ease: Back.easeOut.config(7, 1), delay: 0.25,
                            onStart: function () {
                                _this._spinLabel.tint = 0xFFFFFF;
                            },
                            onComplete: function () {
                                _this._maticLabel.play();
                            }
                        });
                    }
                });
                this._maticLabel.onComplete = function () {
                    TweenLite.to(_this._entertainmentLabel, 1, {
                        alpha: 1, ease: Linear.easeNone, delay: 0.1,
                        onComplete: function () {
                            _this.emit("animationcomplete");
                        }
                    });
                };
            };
            return BrandLogo;
        }(Core.Parts.Container));
        Components.BrandLogo = BrandLogo;
    })(Components = Core.Components || (Core.Components = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var AnimationStateType;
        (function (AnimationStateType) {
            AnimationStateType["AnimationPlaying"] = "AnimationPlaying";
            AnimationStateType["AnimationStopped"] = "AnimationStopped";
        })(AnimationStateType = Controller.AnimationStateType || (Controller.AnimationStateType = {}));
        var AnimationType;
        (function (AnimationType) {
            AnimationType["BigWin"] = "Bigwin";
            AnimationType["MatchValues"] = "MatchValues";
        })(AnimationType = Controller.AnimationType || (Controller.AnimationType = {}));
        var AnimationsController = (function () {
            function AnimationsController() {
                this._animationSort = [
                    AnimationType.MatchValues,
                    AnimationType.BigWin
                ];
                AnimationsController.Instance = this;
            }
            AnimationsController.prototype.playNextAnimations = function () {
                this._animationState = AnimationStateType.AnimationPlaying;
                if (this._animations.length == 0) {
                    this._animationState = AnimationStateType.AnimationStopped;
                    this._stage.buttonState = Core.ButtonStateType.updateData;
                    this._stage.visualType = Core.VisualType.normal;
                    Controller.SoundController.instance.stopBackgroundSound();
                    this.checkPopup();
                }
                else {
                    switch (this._animations[0]) {
                        case AnimationType.MatchValues:
                            this._stage.machineView.playAnimation(.5, 0);
                            break;
                        case AnimationType.BigWin:
                            this._stage.bigwinPopupView.playAnimation();
                            break;
                    }
                    delete this._animations[0];
                    this._animations.splice(0, 1);
                }
            };
            AnimationsController.prototype.checkPopup = function () {
                var earn = Controller.DataController.Instance.earnCents / 100;
                var popupController = this._stage.errorPopupMV.popupController;
                earn > 0 ? popupController.setPopupType(Core.Controller.PopupType.Win) : popupController.closePopup();
            };
            AnimationsController.prototype.sortScenarioAnimation = function () {
                var value = Controller.DataController.Instance.credit - Controller.DataController.Instance.earnCents;
                this._stage.uiView.updateCreditValueText(value);
                this._stage.machineView.controller.matchCount = 0;
                var bigwin = (Controller.DataController.Instance.winType == Core.WinType.bigwin);
                this._animations = new Array();
                for (var i = 0; i < this._animationSort.length; i++) {
                    switch (this._animationSort[i]) {
                        case AnimationType.MatchValues:
                            this._animations.push(AnimationType.MatchValues);
                            break;
                        case AnimationType.BigWin:
                            if (bigwin)
                                this._animations.push(AnimationType.BigWin);
                            break;
                    }
                }
                this.playNextAnimations();
            };
            Object.defineProperty(AnimationsController.prototype, "animationState", {
                get: function () {
                    return this._animationState;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationsController.prototype, "stage", {
                set: function (stage) {
                    this._stage = stage;
                },
                enumerable: true,
                configurable: true
            });
            return AnimationsController;
        }());
        Controller.AnimationsController = AnimationsController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var BackgroundController = (function () {
            function BackgroundController(backgroundview, stage) {
                this._stage = stage;
                this._backgroundView = backgroundview;
            }
            return BackgroundController;
        }());
        Controller.BackgroundController = BackgroundController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var BetButtonType;
        (function (BetButtonType) {
            BetButtonType[BetButtonType["Min"] = 0] = "Min";
            BetButtonType[BetButtonType["Plus"] = 1] = "Plus";
        })(BetButtonType = Controller.BetButtonType || (Controller.BetButtonType = {}));
        var BetController = (function () {
            function BetController(betView, stage) {
                this._betIndex = 0;
                this._betButtonDown = false;
                this._stage = stage;
                this._betView = betView;
                this._betValues = Controller.DataController.Instance.betValues;
                this._betIndex = Controller.DataController.Instance.betIndex;
            }
            BetController.prototype.betButtonUp = function (buttonType) {
                this.stopButtonTimeline();
                this._betButtonDown = false;
            };
            BetController.prototype.betButtonDown = function (buttonType) {
                var _this = this;
                if (this._betButtonDown == false) {
                    this._betButtonDown = true;
                    this.stopButtonTimeline();
                    this._betButtonTimeline = new TimelineMax({
                        repeat: -1, repeatDelay: .2,
                        onStart: function () {
                            Controller.SoundController.instance.playBetChangedSound();
                            _this.calculeteBetValue(buttonType);
                        },
                        onRepeat: function () {
                            var onRepeat;
                            switch (buttonType) {
                                case BetButtonType.Min:
                                    onRepeat = (_this._betIndex != 0);
                                    break;
                                case BetButtonType.Plus:
                                    onRepeat = (_this._betIndex != _this._betValues.length - 1);
                                    break;
                            }
                            onRepeat = onRepeat && Controller.AnimationsController.Instance.animationState != Controller.AnimationStateType.AnimationPlaying;
                            if (onRepeat) {
                                Controller.SoundController.instance.playBetChangedSound();
                                _this.calculeteBetValue(buttonType);
                            }
                        }
                    });
                }
            };
            BetController.prototype.calculeteBetValue = function (buttonType) {
                switch (buttonType) {
                    case BetButtonType.Min:
                        if (this._betIndex > 0)
                            this._betIndex--;
                        break;
                    case BetButtonType.Plus:
                        if (this._betIndex < this._betValues.length - 1)
                            this._betIndex++;
                        break;
                }
                this.betStatus(BetButtonType.Min);
                this.betStatus(BetButtonType.Plus);
                this._betView.betValueText = this._betValues[this._betIndex];
                this._stage.payoutView.controller.updatePayoutData();
            };
            BetController.prototype.betStatus = function (buttonType) {
                switch (buttonType) {
                    case BetButtonType.Min:
                        this._betView.betMinButton.isEnabled = (this._betIndex != 0);
                        break;
                    case BetButtonType.Plus:
                        this._betView.betPlusButton.isEnabled = (this._betIndex != this._betValues.length - 1);
                        break;
                }
                this._betButtonDown = false;
            };
            BetController.prototype.stopButtonTimeline = function () {
                if (this._betButtonTimeline) {
                    this._betButtonTimeline.progress(0, true);
                    this._betButtonTimeline.kill();
                    this._betButtonTimeline = null;
                }
            };
            Object.defineProperty(BetController.prototype, "betValue", {
                get: function () {
                    return this._betValues[this._betIndex];
                },
                enumerable: true,
                configurable: true
            });
            return BetController;
        }());
        Controller.BetController = BetController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var BigWinPopupController = (function () {
            function BigWinPopupController(bigWinPopupMV, stage) {
                this._stage = stage;
                this._bigWinPopupMV = bigWinPopupMV;
            }
            return BigWinPopupController;
        }());
        Controller.BigWinPopupController = BigWinPopupController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var CardController = (function () {
            function CardController(cardView, stage) {
                this._cardNumberView = [];
                this._stage = stage;
                this._cardView = cardView;
            }
            CardController.prototype.newCardButtonUp = function () {
                Controller.SoundController.instance.playNewCardSound();
                this._stage.bingoType = Core.BingoType.normal;
                this._stage.visualType = Core.VisualType.instant;
                Core.Game.instance.service.send(Core.SendAction.newCard);
                this._stage.buttonState = Core.ButtonStateType.sendAction;
            };
            CardController.prototype.setNewData = function () {
                this.destroyCardNumberView();
                this._stage.bingoMatrixView.controller.removeMatrixData();
                this._stage.payoutView.controller.updatePayoutData();
                this._cardView.playCardAnimation();
            };
            CardController.prototype.destroyCardNumberView = function () {
                for (var i = 0; i < this._cardNumberView.length; i++)
                    this._cardNumberView[i].destroy();
            };
            CardController.prototype.updateCardData = function () {
                this._cardNumberView = [];
                var counter = 0;
                var xOffset = 36.3;
                var yOffset = 33;
                for (var i = 0; i < Controller.DataController.Instance.columnCounter; i++) {
                    for (var j = 0; j < Controller.DataController.Instance.lineCounter; j++) {
                        if (Controller.DataController.Instance.cardMatrix[counter] != null) {
                            var number = new Core.View.CardNumberView(this._cardView);
                            number.numberText = Controller.DataController.Instance.cardMatrix[counter];
                            number.setValuesPosition(305 + i * xOffset, 541 + j * yOffset);
                            number.controller.numberStateType = Controller.CardNumberState.Empty;
                            number.playCardNumberTextAnimation();
                            number.idNumber = Controller.DataController.Instance.cardMatrix[counter];
                            this._cardNumberView.push(number);
                        }
                        counter++;
                    }
                }
                this._stage.bingoMatrixView.controller.removeMatrixData();
            };
            Object.defineProperty(CardController.prototype, "cardNumberView", {
                get: function () {
                    return this._cardNumberView;
                },
                enumerable: true,
                configurable: true
            });
            return CardController;
        }());
        Controller.CardController = CardController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var CardNumberState;
        (function (CardNumberState) {
            CardNumberState["Match"] = "Match";
            CardNumberState["Empty"] = "Empty";
        })(CardNumberState = Controller.CardNumberState || (Controller.CardNumberState = {}));
        var CardNumberController = (function () {
            function CardNumberController(cardView, cardNumberView) {
                this._cardNumberView = cardNumberView;
                this._cardView = cardView;
            }
            CardNumberController.prototype.setNumberPosition = function (x, y) {
                this._cardNumberView.setValuesPosition(x, y);
            };
            Object.defineProperty(CardNumberController.prototype, "number", {
                get: function () {
                    return this._number;
                },
                set: function (value) {
                    this._cardNumberView.numberText = value;
                    this._number = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CardNumberController.prototype, "numberStateType", {
                get: function () {
                    return this._numberMode;
                },
                set: function (type) {
                    this._numberMode = type;
                    this._cardNumberView.playBoxAnim(type);
                },
                enumerable: true,
                configurable: true
            });
            return CardNumberController;
        }());
        Controller.CardNumberController = CardNumberController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var DataController = (function () {
            function DataController() {
                DataController.Instance = this;
            }
            DataController.prototype.initData = function (data) {
                this._betValues = data.betLevel.values;
                this._betIndex = Math.max(0, data.betLevel.values.indexOf(data.betLevel.default));
                this._cardColumnCount = data.cardColumnCount;
                this._cardLineCount = data.cardLineCount;
                this._cardMatrix = data.cardMatrix;
                this._clientAction = data.clientAction;
                this._credit = data.credit;
                this._finishResultPosition = data.finishResultPosition;
                this._nextAction = data.nextAction;
                this._selectedGlobes = data.selectedGlobes;
                this._winType = data.winType;
                this._payoutData = data.payoutData;
                this._earnCoins = data.earn.coins;
                this._earnCents = data.earn.cents;
                this._currencyDSeparator = data.currency.decimalSeparator;
                this._currencyTSeparator = data.currency.thousandSeparator;
                this._currencyPosition = data.currency.position;
                this._currencyCode = data.currency.code;
                this._currency = data.currency.symbol;
                this._finishResultPosition = data.finishResultPosition;
                this._gameHistory = data.gameHistoryUrl;
            };
            DataController.prototype.updateData = function (data) {
                this._cardMatrix = data.cardMatrix;
                this._clientAction = data.clientAction;
                this._credit = data.credit;
                this._nextAction = data.nextAction;
                this._selectedGlobes = data.selectedGlobes;
                this._winType = data.winType;
                this._payoutData = data.payoutData;
                this._earnCoins = data.earn.coins;
                this._earnCents = data.earn.cents;
                this._currencyDSeparator = data.currency.decimalSeparator;
                this._currencyTSeparator = data.currency.thousandSeparator;
                this._currencyPosition = data.currency.position;
                this._currency = data.currency.symbol;
                this._finishResultPosition = data.finishResultPosition;
            };
            DataController.prototype.resolveFormat = function (amount) {
                var dec = 2;
                var int = 3;
                var d = this._currencyDSeparator;
                var t = this._currencyTSeparator;
                var r = ("\\d(?=(\\d{" + (int || 3) + "})+" + (dec > 0 ? "\\D" : "$") + ")");
                var n = amount.toFixed(Math.max(0, ~~dec));
                var b = (d ? n.replace(".", d) : n).replace(new RegExp(r, "g"), "$&" + (t || ","));
                var p = this._currencyPosition;
                var s = this._currency;
                var sc = s ? String.fromCharCode(s) : this._currencyCode;
                switch (p) {
                    case "suffix":
                        b = (b + " " + sc);
                        break;
                    case "prefix":
                        b = (sc + " " + b);
                        break;
                }
                return b;
            };
            Object.defineProperty(DataController.prototype, "earnCoins", {
                get: function () {
                    return this._earnCoins;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "earnCents", {
                get: function () {
                    return this._earnCents;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "currencyCode", {
                get: function () {
                    return this._currencyCode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "payoutData", {
                get: function () {
                    return this._payoutData;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "winType", {
                get: function () {
                    return this._winType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "lineCounter", {
                get: function () {
                    return this._cardLineCount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "columnCounter", {
                get: function () {
                    return this._cardColumnCount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "cardMatrix", {
                get: function () {
                    return this._cardMatrix;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "betValues", {
                get: function () {
                    return this._betValues;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "resultValues", {
                get: function () {
                    return this._selectedGlobes;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "betIndex", {
                get: function () {
                    return this._betIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "finishResultPosition", {
                get: function () {
                    return this._finishResultPosition;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "gameHistory", {
                get: function () {
                    return this._gameHistory;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataController.prototype, "credit", {
                get: function () {
                    return this._credit;
                },
                enumerable: true,
                configurable: true
            });
            return DataController;
        }());
        Controller.DataController = DataController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var MachineController = (function () {
            function MachineController(machineView, stage) {
                this._matchCount = 0;
                this._stage = stage;
                this._machineView = machineView;
            }
            MachineController.prototype.checkMatchValues = function (counter) {
                var bingoMatch = false;
                this._stage.machineView.playHeadElectricEffect();
                var resultValues = Controller.DataController.Instance.resultValues;
                var cardValues = this._stage.cardView.controller.cardNumberView;
                var cardValue;
                for (var i = 0; i < cardValues.length; i++) {
                    if (cardValues[i].idNumber == resultValues[counter]) {
                        bingoMatch = true;
                        this._matchCount++;
                        cardValue = i;
                    }
                }
                if (bingoMatch) {
                    this._stage.bingoMatrixView.matrixBoxView[resultValues[counter] - 1].controller.numberStateType = Controller.MatrixBoxStateType.Match;
                    this._stage.cardView.controller.cardNumberView[cardValue].controller.numberStateType = Controller.CardNumberState.Match;
                }
                else {
                    this._stage.bingoMatrixView.matrixBoxView[resultValues[counter] - 1].controller.numberStateType = Controller.MatrixBoxStateType.Pass;
                }
                if ((counter) == this._stage.payoutView.controller.payoutSelectorView[this._stage.payoutView.controller.counter].ballsCounter) {
                    if (this._stage.payoutView.controller.counter < this._stage.payoutView.controller.payoutSelectorView.length) {
                        this._stage.payoutView.controller.payoutSelectorView[this._stage.payoutView.controller.counter + 1].controller.indicatorStateType = Core.Controller.IndicatorState.Match;
                        Controller.SoundController.instance.playPayoutChangedSound();
                    }
                    this._stage.payoutView.controller.payoutSelectorView[this._stage.payoutView.controller.counter].controller.indicatorStateType = Core.Controller.IndicatorState.Empty;
                    this._stage.payoutView.controller.counter++;
                }
                this._stage.bingoMatrixView.changeHeaderText(counter + 1);
            };
            MachineController.prototype.showResult = function () {
                var ball;
                for (var i = 0; i < this._stage.bingoMatrixView.matrixBoxView.length; i++) {
                    if (this._stage.bingoMatrixView.matrixBoxView[i].controller.numberStateType == Controller.MatrixBoxStateType.OnScreen) {
                        this._stage.bingoMatrixView.matrixBoxView[i].controller.numberStateType = Controller.MatrixBoxStateType.Match;
                    }
                }
                for (var i = 0; i < Controller.DataController.Instance.resultValues.length; i++) {
                    if (i == Controller.DataController.Instance.finishResultPosition) {
                        break;
                    }
                    if (this._stage.bingoMatrixView.matrixBoxView[Controller.DataController.Instance.resultValues[i] - 1].controller.numberStateType == Controller.MatrixBoxStateType.Empty)
                        this._stage.bingoMatrixView.matrixBoxView[Controller.DataController.Instance.resultValues[i] - 1].controller.numberStateType = Controller.MatrixBoxStateType.Pass;
                }
                for (var i = 0; i < this._stage.cardView.controller.cardNumberView.length; i++)
                    this._stage.cardView.controller.cardNumberView[i].playBoxAnim(Core.Controller.CardNumberState.Match);
                for (var i = 0; i < this._stage.payoutView.controller.payoutSelectorView.length; i++) {
                    this._stage.payoutView.controller.payoutSelectorView[i].controller.indicatorStateType = Controller.IndicatorState.Empty;
                    if (this._stage.payoutView.controller.payoutSelectorView[i].ballsCounter >= Controller.DataController.Instance.finishResultPosition) {
                        this._stage.payoutView.controller.payoutSelectorView[i].controller.indicatorStateType = Controller.IndicatorState.Match;
                        ball = i;
                        break;
                    }
                }
                this._stage.bingoMatrixView.changeHeaderText(Controller.DataController.Instance.finishResultPosition);
                Core.Game.instance.timer.addTimeout(.5, Controller.AnimationsController.Instance.playNextAnimations.bind(Controller.AnimationsController.Instance), null);
            };
            Object.defineProperty(MachineController.prototype, "matchCount", {
                get: function () {
                    return this._matchCount;
                },
                set: function (val) {
                    this._matchCount = val;
                },
                enumerable: true,
                configurable: true
            });
            return MachineController;
        }());
        Controller.MachineController = MachineController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var MatrixBoxStateType;
        (function (MatrixBoxStateType) {
            MatrixBoxStateType["Match"] = "Match";
            MatrixBoxStateType["Pass"] = "Pass";
            MatrixBoxStateType["OnScreen"] = "OnScreen";
            MatrixBoxStateType["Empty"] = "Empty";
        })(MatrixBoxStateType = Controller.MatrixBoxStateType || (Controller.MatrixBoxStateType = {}));
        var MatrixBoxController = (function () {
            function MatrixBoxController(matrixView, matrixBoxView) {
                this._matrixBoxView = matrixBoxView;
                this._matrixView = matrixView;
            }
            MatrixBoxController.prototype.setNumberPosition = function (x, y) {
                this._matrixBoxView.setValuesPosition(x, y);
            };
            Object.defineProperty(MatrixBoxController.prototype, "numberStateType", {
                get: function () {
                    return this._matrixBoxMode;
                },
                set: function (type) {
                    this._matrixBoxMode = type;
                    this._matrixBoxView.playBoxAnim(type);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MatrixBoxController.prototype, "numberValue", {
                get: function () {
                    return this._numberValue;
                },
                set: function (value) {
                    this._matrixBoxView.numberValueText = value;
                    this._numberValue = value;
                },
                enumerable: true,
                configurable: true
            });
            return MatrixBoxController;
        }());
        Controller.MatrixBoxController = MatrixBoxController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var MatrixController = (function () {
            function MatrixController(matrixView, stage) {
                this._stage = stage;
                this._matrixView = matrixView;
            }
            MatrixController.prototype.updateMatrixData = function () {
                this.removeMatrixData();
                Core.Game.instance.timer.addTimeout(.5, Controller.AnimationsController.Instance.playNextAnimations.bind(Controller.AnimationsController.Instance), null);
            };
            MatrixController.prototype.removeMatrixData = function () {
                for (var t = 0; t < this._matrixView.matrixBoxView.length; t++)
                    this._matrixView.matrixBoxView[t].controller.numberStateType = Controller.MatrixBoxStateType.Empty;
                for (var i = 0; i < this._stage.cardView.controller.cardNumberView.length; i++) {
                    var number = this._stage.cardView.controller.cardNumberView[i].idNumber - 1;
                    this._matrixView.matrixBoxView[number].controller.numberStateType = Controller.MatrixBoxStateType.OnScreen;
                }
                this._matrixView.changeHeaderText(0);
            };
            return MatrixController;
        }());
        Controller.MatrixController = MatrixController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var PayoutController = (function () {
            function PayoutController(payoutView, stage) {
                this._payoutSelectorView = [];
                this._stage = stage;
                this._payout = payoutView;
            }
            PayoutController.prototype.updatePayoutData = function () {
                this._counter = 0;
                this.destroyPayoutSelectorView();
                this._payoutSelectorView = [];
                this.createPayoutSelectorView(0);
            };
            PayoutController.prototype.destroyPayoutSelectorView = function () {
                for (var i = 0; i < this._payoutSelectorView.length; i++)
                    this._payoutSelectorView[i].destroy();
            };
            PayoutController.prototype.createPayoutSelectorView = function (index) {
                if (Controller.DataController.Instance.payoutData.length == index) {
                    this._payoutSelectorView[0].controller.indicatorStateType = Controller.IndicatorState.Match;
                    this._stage.uiView.winValueText = "";
                    return;
                }
                var payoutSelectorView = new Core.View.PayoutSelectorView(this._payout);
                var value = Controller.DataController.Instance.payoutData[index].payout * (this._stage.betView.controller.betValue / 100);
                if (value > Controller.DataController.Instance.payoutData[0].payout)
                    value = Controller.DataController.Instance.payoutData[0].payout;
                payoutSelectorView.setValues(Controller.DataController.Instance.payoutData[index].globeNumber, value);
                payoutSelectorView.valuesPosition(959, 45 + index * 23);
                payoutSelectorView.controller.indicatorStateType = Controller.IndicatorState.Empty;
                this._payoutSelectorView.push(payoutSelectorView);
                index++;
                this.createPayoutSelectorView(index);
            };
            PayoutController.prototype.resultPayoutIndex = function () {
                for (var i = 0; i < this._payoutSelectorView.length; i++) {
                    if (this._payoutSelectorView[i].ballsCounter >= Controller.DataController.Instance.finishResultPosition)
                        return i;
                }
            };
            Object.defineProperty(PayoutController.prototype, "payoutSelectorView", {
                get: function () {
                    return this._payoutSelectorView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PayoutController.prototype, "counter", {
                get: function () {
                    return this._counter;
                },
                set: function (val) {
                    this._counter = val;
                },
                enumerable: true,
                configurable: true
            });
            return PayoutController;
        }());
        Controller.PayoutController = PayoutController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var IndicatorState;
        (function (IndicatorState) {
            IndicatorState["Match"] = "Match";
            IndicatorState["Empty"] = "Empty";
            IndicatorState["Loop"] = "Loop";
        })(IndicatorState = Controller.IndicatorState || (Controller.IndicatorState = {}));
        var PayoutSelectorController = (function () {
            function PayoutSelectorController(payoutView, payoutSelectorView) {
                this._payoutSelectorView = payoutSelectorView;
                this._payoutView = payoutView;
            }
            Object.defineProperty(PayoutSelectorController.prototype, "indicatorStateType", {
                get: function () {
                    return this._indicatorStateType;
                },
                set: function (type) {
                    this._indicatorStateType = type;
                    this._payoutSelectorView.playSelectorAnim(type);
                },
                enumerable: true,
                configurable: true
            });
            return PayoutSelectorController;
        }());
        Controller.PayoutSelectorController = PayoutSelectorController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var PlayController = (function () {
            function PlayController(playView, stage) {
                this._stage = stage;
                this._playView = playView;
            }
            PlayController.prototype.playButtonUp = function () {
                if (Controller.AnimationsController.Instance.animationState != Controller.AnimationStateType.AnimationPlaying) {
                    if (!this.checkBalance) {
                        this._stage.buttonState = Core.ButtonStateType.sendAction;
                        this._stage.visualType = Core.VisualType.instant;
                        this._stage.cardView.controller.setNewData();
                        Controller.SoundController.instance.playButtonSound();
                        Core.Game.instance.service.send(Core.SendAction.globeSelect, { betlevel: this._stage.betView.controller.betValue });
                    }
                }
                else {
                    this._stage.bingoType = Core.BingoType.instant;
                    this._stage.visualType = Core.VisualType.instant;
                    this._stage.buttonState = Core.ButtonStateType.instant;
                }
            };
            Object.defineProperty(PlayController.prototype, "checkBalance", {
                get: function () {
                    if (Controller.DataController.Instance.credit < 0) {
                        this._stage.errorPopupMV.popupController.setPopupType(Controller.PopupType.InsufficientBalanceNotenoughBalance);
                        return true;
                    }
                    else if ((Controller.DataController.Instance.credit - Controller.DataController.Instance.betValues[0]) < 0) {
                        this._stage.errorPopupMV.popupController.setPopupType(Controller.PopupType.InsufficientBalanceMinimumBetLevel);
                        return true;
                    }
                    else if ((Controller.DataController.Instance.credit - this._stage.betView.controller.betValue) < 0) {
                        this._stage.errorPopupMV.popupController.setPopupType(Controller.PopupType.InsufficientBalanceCurrentBetLevel);
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                enumerable: true,
                configurable: true
            });
            return PlayController;
        }());
        Controller.PlayController = PlayController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var PopupButtonType;
        (function (PopupButtonType) {
            PopupButtonType[PopupButtonType["Reload"] = 0] = "Reload";
            PopupButtonType[PopupButtonType["ContinueGame"] = 1] = "ContinueGame";
            PopupButtonType[PopupButtonType["Okay"] = 2] = "Okay";
        })(PopupButtonType = Controller.PopupButtonType || (Controller.PopupButtonType = {}));
        var PopupType;
        (function (PopupType) {
            PopupType["Status"] = "Status";
            PopupType["Parse"] = "Parse";
            PopupType["Websocket"] = "Websocket";
            PopupType["MessageId"] = "MessageId";
            PopupType["InsufficientBalanceCurrentBetLevel"] = "InsufficientBalanceCurrentBetLevel";
            PopupType["InsufficientBalanceMinimumBetLevel"] = "InsufficientBalanceMinimumBetLevel";
            PopupType["InsufficientBalanceNotenoughBalance"] = "InsufficientBalanceNotenoughBalance";
            PopupType["ReconnectRestoreSession"] = "ReconnectRestoreSession";
            PopupType["Win"] = "Win";
        })(PopupType = Controller.PopupType || (Controller.PopupType = {}));
        var PopupController = (function () {
            function PopupController(popupMV, stage) {
                this._popupMV = popupMV;
                this._stage = stage;
                this.initEvent();
            }
            PopupController.prototype.initEvent = function () {
                this.initServiceError();
            };
            PopupController.prototype.initServiceError = function () {
                var _this = this;
                this._popupMV.mainStage.uiView.winValueText = "";
                var header, context;
                header = Core.Game.instance.language.parse(Core.LanguageNames.ErrorGeneralHeader);
                Core.Game.instance.service.once(Core.ListenerType.error, function (type, action, message) {
                    switch (type) {
                        case PopupType[PopupType.Status]:
                            context = Core.Game.instance.language.parse(Core.LanguageNames.ErrorParse);
                            _this._popupMV.popupType(header, context, PopupButtonType.Reload);
                            break;
                        case PopupType[PopupType.Parse]:
                            context = Core.Game.instance.language.parse(Core.LanguageNames.ErrorParse);
                            _this._popupMV.popupType(header, context, PopupButtonType.Reload);
                            break;
                        default:
                            _this._popupMV.popupType(header, message, PopupButtonType.Reload);
                            break;
                    }
                }, this);
                Core.Game.instance.service.once(Core.ListenerType.close, function (event) {
                    header = Core.Game.instance.language.parse(Core.LanguageNames.ErrorConnectionHeader);
                    context = Core.LanguageNames.ErrorConnection;
                    _this._popupMV.popupType(header, context, PopupButtonType.Reload);
                }, this);
            };
            PopupController.prototype.setPopupType = function (popupType) {
                Controller.SoundController.instance.stopBackgroundSound();
                this._popupMV.mainStage.uiView.winValueText = "";
                Controller.SoundController.instance.playCongPanelSound();
                var header, context;
                header = Core.Game.instance.language.parse(Core.LanguageNames.ErrorInsufficientfundsHeader);
                switch (popupType) {
                    case PopupType.InsufficientBalanceNotenoughBalance:
                        context = Core.Game.instance.language.parse(Core.LanguageNames.ErrorInsufficientfundsBalance);
                        this._stage.errorPopupMV.popupType(header, context, PopupButtonType.Okay);
                        break;
                    case PopupType.InsufficientBalanceCurrentBetLevel:
                        context = Core.Game.instance.language.parse(Core.LanguageNames.ErrorInsufficientfundsCurrentBet);
                        this._stage.errorPopupMV.popupType(header, context, PopupButtonType.Okay);
                        break;
                    case PopupType.InsufficientBalanceMinimumBetLevel:
                        context = Core.Game.instance.language.parse(Core.LanguageNames.ErrorInsufficientfundsMinBet);
                        this._stage.errorPopupMV.popupType(header, context, PopupButtonType.Okay);
                        break;
                    case PopupType.ReconnectRestoreSession:
                        header = Core.Game.instance.language.parse(Core.LanguageNames.ErrorReconnectRestoreSessionHeader);
                        context = Core.Game.instance.language.parse(Core.LanguageNames.ErrorReconnectRestoreSession);
                        this._stage.errorPopupMV.popupType(header, context, PopupButtonType.ContinueGame);
                        break;
                    case PopupType.Win:
                        header = Core.Game.instance.language.parse(Core.LanguageNames.WinPopupHeader);
                        context = Core.Game.instance.language.parse(Core.LanguageNames.WinPopupWon);
                        context += "\n" + Controller.DataController.Instance.resolveFormat(Controller.DataController.Instance.earnCents / 100) + "\n";
                        this._popupMV.mainStage.uiView.winValueText = Controller.DataController.Instance.resolveFormat(Controller.DataController.Instance.earnCents / 100);
                        this._popupMV.popupType(header, context, PopupButtonType.Okay);
                        break;
                }
            };
            PopupController.prototype.reloadGame = function () {
                location.reload();
            };
            PopupController.prototype.continueGame = function () {
                this._popupMV.tweenVisiblePopupContainer(false);
                Core.Game.instance.timer.addTimeout(1.5, Controller.AnimationsController.Instance.playNextAnimations.bind(Controller.AnimationsController.Instance), null);
            };
            PopupController.prototype.closePopup = function () {
                this._stage.bingoType = Core.BingoType.normal;
                this._stage.buttonState = Core.ButtonStateType.response;
                this._stage.uiView.updateWinValue();
                this._stage.uiView.updateCreditValueText(Controller.DataController.Instance.credit);
                Controller.SoundController.instance.playAmbianceNormalSound();
                this._popupMV.tweenVisiblePopupContainer(false);
                var payaoutIndex = this._stage.payoutView.controller.resultPayoutIndex();
                this._stage.payoutView.controller.payoutSelectorView[payaoutIndex].playSelectorAnim(Controller.IndicatorState.Loop);
            };
            Object.defineProperty(PopupController.prototype, "mainStage", {
                get: function () {
                    return this._stage;
                },
                enumerable: true,
                configurable: true
            });
            return PopupController;
        }());
        Controller.PopupController = PopupController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Singleton;
    (function (Singleton) {
        var ResourceController = (function () {
            function ResourceController() {
                ResourceController.Instance = this;
            }
            ResourceController.prototype.addResources = function () {
                Core.Game.instance.resource.reset(true, true);
                this.addVisuals();
                this.addSounds();
            };
            ResourceController.prototype.addVisuals = function () {
                Core.Game.instance.resource.addTexture("assets/sprites/background-0.json");
                Core.Game.instance.resource.addTexture("assets/sprites/background-1.json");
                Core.Game.instance.resource.addTexture("assets/sprites/background-2.json");
                Core.Game.instance.resource.addTexture("assets/sprites/ui.json");
                Core.Game.instance.resource.addTexture("assets/sprites/playButtonEffect.json");
                Core.Game.instance.resource.addTexture("assets/sprites/turboButtonEffect.json");
                Core.Game.instance.resource.addTexture("assets/sprites/headEffect.json");
                Core.Game.instance.resource.addTexture("assets/sprites/noseSmokeEffect.json");
                Core.Game.instance.resource.addTexture("assets/sprites/headElectric.json");
                Core.Game.instance.resource.addTexture("assets/sprites/turboSmoke-0.json");
                Core.Game.instance.resource.addTexture("assets/sprites/turboSmoke-1.json");
                Core.Game.instance.resource.addTexture("assets/sprites/monitorAnim-0.json");
                Core.Game.instance.resource.addTexture("assets/sprites/monitorAnim-1.json");
                Core.Game.instance.resource.addTexture("assets/sprites/SmokeAnim1.json");
                Core.Game.instance.resource.addTexture("assets/sprites/SmokeAnim2.json");
                Core.Game.instance.resource.addTexture("assets/sprites/SmokeAnim3.json");
            };
            ResourceController.prototype.addSounds = function () {
                Core.Game.instance.resource.addSound("Bigwin", "SpecialsSound", ["assets/sounds/ogg/bigwin.ogg", "assets/sounds/mp3/bigwin.mp3", "assets/sounds/mp3/bigwin.wav"]);
                Core.Game.instance.resource.addSound("AmbianceNormal", "BackgroundSound", ["assets/sounds/ogg/ambiance_normal.ogg", "assets/sounds/mp3/ambiance_normal.mp3", "assets/sounds/mp3/ambiance_normal.wav"]);
                Core.Game.instance.resource.addSound("AmbianceTurbo", "BackgroundSound", ["assets/sounds/ogg/ambiance_turbo.ogg", "assets/sounds/mp3/ambiance_turbo.mp3", "assets/sounds/mp3/ambiance_turbo.wav"]);
                Core.Game.instance.resource.addSound("NewCard", "SpecialsSound", ["assets/sounds/ogg/new_card.ogg", "assets/sounds/mp3/new_card.mp3", "assets/sounds/mp3/new_card.wav"]);
                Core.Game.instance.resource.addSound("NormalMachineCounter", "SpecialsSound", ["assets/sounds/ogg/normalmachinecounter.ogg", "assets/sounds/mp3/normalmachinecounter.mp3", "assets/sounds/mp3/new_card.wav"]);
                Core.Game.instance.resource.addSound("PayoutChanged", "SpecialsSound", ["assets/sounds/ogg/paytable_changed.ogg", "assets/sounds/mp3/paytable_changed.mp3", "assets/sounds/mp3/paytable_changed.wav"]);
                Core.Game.instance.resource.addSound("PlayButton", "SpecialsSound", ["assets/sounds/ogg/play_button.ogg", "assets/sounds/mp3/play_button.mp3", "assets/sounds/mp3/play_button.wav"]);
                Core.Game.instance.resource.addSound("TurboMachineCounter", "SpecialsSound", ["assets/sounds/ogg/turbomachinecounter.ogg", "assets/sounds/mp3/turbomachinecounter.mp3", "assets/sounds/mp3/turbomachinecounter.wav"]);
                Core.Game.instance.resource.addSound("TurboButton", "SpecialsSound", ["assets/sounds/ogg/turbo_button.ogg", "assets/sounds/mp3/turbo_button.mp3", "assets/sounds/mp3/turbo_button.wav"]);
                Core.Game.instance.resource.addSound("NumberElectric", "SpecialsSound", ["assets/sounds/ogg/numberelectric.ogg", "assets/sounds/mp3/numberelectric.mp3", "assets/sounds/mp3/numberelectric.wav"]);
                Core.Game.instance.resource.addSound("Click", "SpecialsSound", ["assets/sounds/ogg/click.ogg", "assets/sounds/mp3/click.mp3", "assets/sounds/mp3/click.wav"]);
                Core.Game.instance.resource.addSound("BetChanged", "SpecialsSound", ["assets/sounds/ogg/betchanged.ogg", "assets/sounds/mp3/betchanged.mp3", "assets/sounds/mp3/betchanged.wav"]);
                Core.Game.instance.resource.addSound("CardVibration", "SpecialsSound", ["assets/sounds/ogg/cardvibration.ogg", "assets/sounds/mp3/cardvibration.mp3", "assets/sounds/mp3/cardvibration.wav"]);
                Core.Game.instance.resource.addSound("ShortSmoke01", "SpecialsSound", ["assets/sounds/ogg/shortsmoke01.ogg", "assets/sounds/mp3/shortsmoke01.mp3", "assets/sounds/mp3/shortsmoke01.wav"]);
                Core.Game.instance.resource.addSound("ShortSmoke02", "SpecialsSound", ["assets/sounds/ogg/shortsmoke02.ogg", "assets/sounds/mp3/shortsmoke02.mp3", "assets/sounds/mp3/shortsmoke02.wav"]);
                Core.Game.instance.resource.addSound("ElectricNormal", "SpecialsSound", ["assets/sounds/ogg/electricnormal.ogg", "assets/sounds/mp3/electricnormal.mp3", "assets/sounds/mp3/electricnormal.wav"]);
                Core.Game.instance.resource.addSound("ElectricTurbo", "SpecialsSound", ["assets/sounds/ogg/electricturbo.ogg", "assets/sounds/mp3/electricturbo.mp3", "assets/sounds/mp3/electricturbo.wav"]);
                Core.Game.instance.resource.addSound("NumberCounter", "SpecialsSound", ["assets/sounds/ogg/numbercounter.ogg", "assets/sounds/mp3/numbercounter.mp3", "assets/sounds/mp3/numbercounter.wav"]);
                Core.Game.instance.resource.addSound("Cong", "SpecialsSound", ["assets/sounds/ogg/congpanel.ogg", "assets/sounds/mp3/congpanel.mp3", "assets/sounds/mp3/congpanel.wav"]);
                Core.Game.instance.resource.addSound("OverButton", "SpecialsSound", ["assets/sounds/ogg/overbutton.ogg", "assets/sounds/mp3/overbutton.mp3", "assets/sounds/mp3/overbutton.wav"]);
                Core.Game.instance.resource.addSound("HeadSmoke", "SpecialsSound", ["assets/sounds/ogg/headsmoke.ogg", "assets/sounds/mp3/headsmoke.mp3", "assets/sounds/mp3/headsmoke.wav"]);
                Core.Game.instance.resource.addSound("MouthSmoke", "SpecialsSound", ["assets/sounds/ogg/mouthsmoke.ogg", "assets/sounds/mp3/mouthsmoke.mp3", "assets/sounds/mp3/mouthsmoke.wav"]);
                Core.Game.instance.resource.addSound("BigwinCount", "SpecialsSound", ["assets/sounds/ogg/bigwincounting.ogg", "assets/sounds/mp3/bigwincounting.mp3", "assets/sounds/mp3/bigwincounting.wav"]);
            };
            return ResourceController;
        }());
        Singleton.ResourceController = ResourceController;
    })(Singleton = Core.Singleton || (Core.Singleton = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var SoundController = (function () {
            function SoundController() {
                this._isMuteSound = true;
                this._isMuteMusic = false;
                this._isMuteSoundFx = false;
                SoundController.instance = this;
                this._soundFXVolume = .5;
                this._backgroundSoundVolume = 1;
            }
            SoundController.prototype.playAmbianceNormalSound = function () {
                Core.Game.instance.sound.play("AmbianceNormal", this._backgroundSoundVolume, true);
            };
            SoundController.prototype.playAmbianceTurboSound = function () {
                Core.Game.instance.sound.play("AmbianceTurbo", this._backgroundSoundVolume, true);
            };
            SoundController.prototype.playBigWinSound = function () {
                Core.Game.instance.sound.play("Bigwin", this._soundFXVolume, false);
            };
            SoundController.prototype.playBigWinCounterSound = function () {
                Core.Game.instance.sound.play("BigwinCount", this._soundFXVolume, false);
            };
            SoundController.prototype.playNewCardSound = function () {
                Core.Game.instance.sound.play("NewCard", this._soundFXVolume, false);
            };
            SoundController.prototype.playNormalMachineCounterSound = function () {
                Core.Game.instance.sound.play("NormalMachineCounter", this._soundFXVolume, false);
            };
            SoundController.prototype.playCounterSound = function () {
                Core.Game.instance.sound.play("NumberCounter", this._soundFXVolume, false);
            };
            SoundController.prototype.playCongPanelSound = function () {
                Core.Game.instance.sound.play("Cong", this._soundFXVolume, false);
            };
            SoundController.prototype.playOverButtonSound = function () {
                Core.Game.instance.sound.play("OverButton", this._soundFXVolume, false);
            };
            SoundController.prototype.playNumberElectricSound = function () {
                Core.Game.instance.sound.play("NumberElectric", this._soundFXVolume, false);
            };
            SoundController.prototype.playShortSmokeSound = function (version) {
                switch (version) {
                    case 0:
                        Core.Game.instance.sound.play("ShortSmoke01", this._soundFXVolume, false);
                        break;
                    case 1:
                        Core.Game.instance.sound.play("ShortSmoke02", this._soundFXVolume, false);
                        break;
                }
            };
            SoundController.prototype.playElectricNormalSound = function () {
                Core.Game.instance.sound.play("ElectricNormal", this._soundFXVolume, false);
            };
            SoundController.prototype.playElectricTurboSound = function () {
                Core.Game.instance.sound.play("ElectricTurbo", this._soundFXVolume, false);
            };
            SoundController.prototype.playCardVibrationSound = function () {
                Core.Game.instance.sound.play("CardVibration", this._soundFXVolume, false);
            };
            SoundController.prototype.playClickSound = function () {
                Core.Game.instance.sound.play("Click", this._soundFXVolume, false);
            };
            SoundController.prototype.playBetChangedSound = function () {
                Core.Game.instance.sound.play("BetChanged", this._soundFXVolume, false);
            };
            SoundController.prototype.playTurboMachineCounterSound = function () {
                Core.Game.instance.sound.play("TurboMachineCounter", this._soundFXVolume, false);
            };
            SoundController.prototype.playPayoutChangedSound = function () {
                Core.Game.instance.sound.play("PayoutChanged", this._soundFXVolume, false);
            };
            SoundController.prototype.playButtonSound = function () {
                Core.Game.instance.sound.play("PlayButton", this._soundFXVolume, false);
            };
            SoundController.prototype.playTurboButtonSound = function () {
                Core.Game.instance.sound.play("TurboButton", this._soundFXVolume, false);
            };
            SoundController.prototype.playHeadSmokeSound = function () {
                Core.Game.instance.sound.play("HeadSmoke", this._soundFXVolume, false);
            };
            SoundController.prototype.playNoseSmokeSound = function () {
                Core.Game.instance.sound.play("MouthSoun", this._soundFXVolume, false);
            };
            SoundController.prototype.stopTurboButtonSound = function () {
                Core.Game.instance.sound.stop("TurboButton");
            };
            SoundController.prototype.stopBigWinCounterSound = function () {
                Core.Game.instance.sound.stop("BigwinCount");
            };
            SoundController.prototype.stopAmbianceNormalSound = function () {
                Core.Game.instance.sound.stop("AmbianceNormal");
            };
            SoundController.prototype.stopAmbianceTurboSound = function () {
                Core.Game.instance.sound.stop("AmbianceTurbo");
            };
            SoundController.prototype.stopBackgroundSound = function () {
                this.stopAmbianceNormalSound();
                this.stopAmbianceTurboSound();
            };
            SoundController.prototype.muteBackgroundSound = function () {
                Core.Game.instance.sound.muteChannel("BackgroundSound");
            };
            SoundController.prototype.muteSpecialsSound = function () {
                Core.Game.instance.sound.muteChannel("SpecialsSound");
            };
            SoundController.prototype.muteSound = function (mute) {
                if (mute) {
                    this.muteSpecialsSound();
                    this.muteBackgroundSound();
                }
                else {
                    this.unMuteSpecialsSound();
                    this.unMuteBackgroundSound();
                }
            };
            SoundController.prototype.unMuteSpecialsSound = function () {
                Core.Game.instance.sound.unmuteChannel("SpecialsSound");
            };
            SoundController.prototype.unMuteBackgroundSound = function () {
                Core.Game.instance.sound.unmuteChannel("BackgroundSound");
            };
            SoundController.prototype.isMuteMusic = function (index) {
                this._isMuteMusic = index;
                if (!this._isMuteMusic && this._isMuteSound) {
                    this.unMuteBackgroundSound();
                }
                else {
                    this.muteBackgroundSound();
                }
            };
            SoundController.prototype.isMuteSoundFx = function (index) {
                this._isMuteSoundFx = index;
                if (!this._isMuteSoundFx && this._isMuteSound) {
                    this.unMuteSpecialsSound();
                }
                else {
                    this.muteSpecialsSound();
                }
            };
            SoundController.prototype.isMuteSound = function (index) {
                this._isMuteSound = index;
                if (this._isMuteSound) {
                    this.isMuteSoundFx(this._isMuteSoundFx);
                    this.isMuteMusic(this._isMuteMusic);
                }
                else {
                    this.muteSound(false);
                }
            };
            return SoundController;
        }());
        Controller.SoundController = SoundController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var TurboController = (function () {
            function TurboController(turboView, stage) {
                this._stage = stage;
                this._turboView = turboView;
            }
            TurboController.prototype.turboButtonUp = function () {
                switch (this._stage.bingoType) {
                    case Core.BingoType.turbo:
                        if (Controller.AnimationsController.Instance.animationState != Controller.AnimationStateType.AnimationPlaying) {
                            this._stage.bingoType = Core.BingoType.normal;
                            this._stage.visualType = Core.VisualType.normal;
                            Controller.SoundController.instance.stopTurboButtonSound();
                        }
                        else {
                            this._stage.buttonState = Core.ButtonStateType.turboDisabled;
                        }
                        break;
                    case Core.BingoType.normal:
                        this._stage.bingoType = Core.BingoType.turbo;
                        this._stage.visualType = Core.VisualType.turbo;
                        Controller.SoundController.instance.playTurboButtonSound();
                        break;
                }
            };
            return TurboController;
        }());
        Controller.TurboController = TurboController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Controller;
    (function (Controller) {
        var UIController = (function () {
            function UIController(uIView, stage) {
                this._isSoundOn = true;
                this._isFullScreen = false;
                this._isOpenContainer = false;
                this._stage = stage;
                this._UIView = uIView;
                this.initEvents();
            }
            UIController.prototype.initEvents = function () {
                this.checkFullScreen();
            };
            UIController.prototype.checkFullScreen = function () {
                var _this = this;
                Core.Game.instance.display.on(Core.ListenerType.fullscreenchange, function (fullscreen) {
                    var asset;
                    fullscreen ? asset = Core.StyleInformation.UI.Minimize : asset = Core.StyleInformation.UI.FullScreen;
                    _this._UIView.fullScreenButton.setFrames(asset);
                });
            };
            UIController.prototype.historyButtonUp = function () {
                window.open(Controller.DataController.Instance.gameHistory, "_blank");
            };
            UIController.prototype.homeButtonUp = function () {
                Core.Essentials.GameUI.backToHome();
            };
            UIController.prototype.helpButtonUp = function () {
                Controller.SoundController.instance.playBetChangedSound();
                window.open(Core.Game.instance.config.menubar.help);
            };
            UIController.prototype.fullScreenButtonUp = function () {
                Controller.SoundController.instance.playBetChangedSound();
                Core.Game.instance.display.toggleFullscreen();
            };
            UIController.prototype.menuButtonUp = function (button) {
                this._isOpenContainer = !this._isOpenContainer;
                Controller.SoundController.instance.playBetChangedSound();
                this._UIView.playMenuBarAnimation(this._isOpenContainer);
            };
            UIController.prototype.soundButtonUp = function () {
                Controller.SoundController.instance.playBetChangedSound();
                Controller.SoundController.instance.muteSound(this._isSoundOn);
                this._isSoundOn = !this._isSoundOn;
                this._UIView.changeSoundFrame(this._isSoundOn);
            };
            return UIController;
        }());
        Controller.UIController = UIController;
    })(Controller = Core.Controller || (Core.Controller = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Essentials;
    (function (Essentials) {
        var Database = (function (_super) {
            __extends(Database, _super);
            function Database() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._data = {};
                return _this;
            }
            Database.prototype.insert = function (key, value) {
                if (this.exists(key) == true && this.fetch(key) == value) {
                    this._data[key] = value;
                    this.emit("insert", key, value, false);
                }
                else {
                    this._data[key] = value;
                    this.emit("insert", key, value, true);
                }
            };
            Database.prototype.fetch = function (key) {
                return this._data[key];
            };
            Database.prototype.exists = function (key) {
                return (key in this._data) ? true : false;
            };
            Database.prototype.reset = function (key) {
                if (this._data.exists(key) == true) {
                    this._data.insert(key, null);
                    this.emit("reset", key, true);
                }
                else {
                    this.emit("reset", key, false);
                }
            };
            Database.prototype.remove = function (key) {
                delete this._data[key];
                this.emit("remove", key);
            };
            Database.prototype.removeAll = function () {
                delete this._data;
                this._data = {};
                this.emit("wipe");
            };
            Database.prototype.forEach = function (callback, callbackContext) {
                for (var key in this._data)
                    callback.call(callbackContext, this._data[key], key, this);
            };
            Object.defineProperty(Database.prototype, "length", {
                get: function () {
                    return Object.keys(this._data).length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Database.prototype, "keys", {
                get: function () {
                    return Object.keys(this._data);
                },
                enumerable: true,
                configurable: true
            });
            return Database;
        }(PIXI.utils.EventEmitter));
        Essentials.Database = Database;
    })(Essentials = Core.Essentials || (Core.Essentials = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Essentials;
    (function (Essentials) {
        var DesktopUI = (function () {
            function DesktopUI() {
            }
            DesktopUI.initUI = function (target, options) {
                try {
                    DesktopUI.target = target;
                    DesktopUI.target && DesktopUI.target.initUI.call(DesktopUI.target, options);
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.showPaytable = function () {
                try {
                    DesktopUI.target && DesktopUI.target.showPaytable.call(DesktopUI.target);
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.showAutoPlay = function (spinCount, currentBet, credit) {
                try {
                    DesktopUI.target && DesktopUI.target.showAutoPlay.call(DesktopUI.target, spinCount, currentBet, credit);
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.hideAutoPlay = function () {
                try {
                    DesktopUI.target && DesktopUI.target.hideAutoPlay.call(DesktopUI.target);
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.showSettings = function () {
                try {
                    DesktopUI.target && DesktopUI.target.showSettings.call(DesktopUI.target);
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.showStatistics = function () {
                try {
                    DesktopUI.target && DesktopUI.target.showStatistics.call(DesktopUI.target);
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.backToHome = function () {
                try {
                    DesktopUI.target && DesktopUI.target.backToHome.call(DesktopUI.target);
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.currency = function (amount, symbol, tsep, dsep, suffix, fractionLimit) {
                try {
                    Essentials.GameUI.target && Essentials.GameUI.target.currency.call(Essentials.GameUI.target, amount, symbol, tsep, dsep, suffix, fractionLimit);
                }
                catch (e) {
                    console.warn("Error on MobileUI");
                    console.warn(e);
                }
            };
            DesktopUI.clearCurrency = function (str, symbol, tsep) {
                try {
                    Essentials.GameUI.target && Essentials.GameUI.target.currency.call(Essentials.GameUI.target, str, symbol, tsep);
                }
                catch (e) {
                    console.warn("Error on MobileUI");
                    console.warn(e);
                }
            };
            DesktopUI.on = function (event, listener, scope) {
                try {
                    DesktopUI.target && DesktopUI.target.on.call(DesktopUI.target, event, listener.bind(scope));
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.off = function (event, listener, scope) {
                try {
                    DesktopUI.target && DesktopUI.target.off.call(DesktopUI.target, event, listener.bind(scope));
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.emit = function (event, scope) {
                try {
                    DesktopUI.target && DesktopUI.target.emit.apply(scope || DesktopUI.target, arguments);
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            DesktopUI.openWindow = function (url, _self) {
                try {
                    DesktopUI.target && DesktopUI.target.openWindow.call(DesktopUI.target, url, _self);
                }
                catch (e) {
                    console.warn("Error on DesktopUI");
                    console.warn(e);
                }
            };
            return DesktopUI;
        }());
        Essentials.DesktopUI = DesktopUI;
    })(Essentials = Core.Essentials || (Core.Essentials = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Essentials;
    (function (Essentials) {
        var IMessageTypes;
        (function (IMessageTypes) {
            IMessageTypes["PRIMARY"] = "A";
            IMessageTypes["SECONDARY"] = "B";
        })(IMessageTypes = Essentials.IMessageTypes || (Essentials.IMessageTypes = {}));
        var UILayouts;
        (function (UILayouts) {
            UILayouts[UILayouts["LEGACY"] = 0] = "LEGACY";
            UILayouts[UILayouts["ALTERNATIVE"] = 1] = "ALTERNATIVE";
        })(UILayouts = Essentials.UILayouts || (Essentials.UILayouts = {}));
        var IInfoBarStates;
        (function (IInfoBarStates) {
            IInfoBarStates["DEFAULT"] = "default";
            IInfoBarStates["GAMBLE"] = "gamble";
            IInfoBarStates["FREESPIN"] = "freespin";
        })(IInfoBarStates = Essentials.IInfoBarStates || (Essentials.IInfoBarStates = {}));
        var SpinButtonIcons;
        (function (SpinButtonIcons) {
            SpinButtonIcons["SPIN"] = "spin";
            SpinButtonIcons["SKIP"] = "skip";
            SpinButtonIcons["STOP"] = "stop";
            SpinButtonIcons["PLAY"] = "play";
        })(SpinButtonIcons = Essentials.SpinButtonIcons || (Essentials.SpinButtonIcons = {}));
        var GameUI = (function () {
            function GameUI() {
            }
            GameUI.setText = function (name, text) {
                switch (name) {
                    case "BetAmountText":
                        break;
                    case "WinAmountText":
                        break;
                    case "CreditAmountText":
                        break;
                    case "BalanceCreditText":
                        break;
                    case "BalanceCoinsText":
                        break;
                    case "CoinAmountText":
                        break;
                    case "CoinValueText":
                        break;
                    case "BetLevelText":
                        break;
                    case "TotalWinAmountText":
                        break;
                }
            };
            GameUI.setUIVisibility = function (value) {
                try {
                    GameUI.target.setUIVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.initUI = function (target, options) {
                try {
                    GameUI.target = target;
                    GameUI.target.initUI(options);
                }
                catch (e) {
                }
            };
            GameUI.setMobileMenuItems = function (values) {
                try {
                    GameUI.target.setMobileMenuItems(values.slice(0));
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setGambleButtonVisibility = function (value) {
                try {
                    GameUI.target.setGambleButtonVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setPaytableVisibility = function (value) {
                try {
                    GameUI.target.setPaytableVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setLayout = function (value) {
                try {
                    GameUI.target.setLayout(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setWifiStrength = function (value) {
                try {
                    GameUI.target.setWifiStrength(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setInfoBarState = function (value) {
                try {
                    GameUI.target.setInfoBarState(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setSpinButtonIcon = function (value) {
                try {
                    GameUI.target.setSpinButtonIcon(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setMessageBarVisibility = function (value) {
                try {
                    GameUI.target.setMessageBarVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setControlBarVisibility = function (value) {
                try {
                    GameUI.target.setControlBarVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setCoinValues = function (values) {
                try {
                    GameUI.target.setCoinValues(values.slice(0));
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setBetLevels = function (values) {
                try {
                    GameUI.target.setBetLevels(values.slice(0));
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setBetWays = function (values) {
                try {
                    GameUI.target.setBetWays(values.slice(0));
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setAutoPlayValues = function (values) {
                try {
                    GameUI.target.setAutoPlayValues(values.slice(0));
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setBetValues = function (values) {
                try {
                    GameUI.target.setBetValues(values.slice(0));
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setAutoPlayIndex = function (value) {
                try {
                    GameUI.target.setAutoPlayIndex(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setAutoPlayValue = function (value) {
                try {
                    GameUI.target.setAutoPlayValue(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setAutoPlayConditions = function (value) {
                try {
                    GameUI.target.setAutoPlayConditions(value.slice(0));
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setSpinResults = function (spinsPlayed, sessionTime, spinsPerHour) {
                try {
                    GameUI.target.setSpinResults(spinsPlayed, sessionTime, spinsPerHour);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setHighestWins = function (first, second, third) {
                try {
                    GameUI.target.setHighestWins(first, second, third);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setGambleValues = function (win, x2, x4) {
                try {
                    GameUI.target.setGambleValues(win, x2, x4);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setBalance = function (credit, coins) {
                try {
                    GameUI.target.setBalance(credit, coins);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setWin = function (credit, coin) {
                try {
                    GameUI.target.setWin(credit, coin);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setTotalWin = function (credit, coin) {
                try {
                    GameUI.target.setTotalWin(credit, coin);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setMessageText = function (msgType, message) {
                try {
                    GameUI.target.setMessageText(msgType, message);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.showFlatModal = function (message, buttonLabel1, callback1, buttonLabel2, callback2) {
                try {
                    GameUI.target.showFlatModal(message, buttonLabel1, callback1, buttonLabel2, callback2);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setModalStyles = function (styles) {
                try {
                    GameUI.target.setModalStyle(styles);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setSettingsVisibility = function (value) {
                try {
                    GameUI.target.setSettingsVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setFooterVisibility = function (value) {
                try {
                    GameUI.target.setFooterVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setAutoPlayVisibility = function (value) {
                try {
                    GameUI.target.setAutoPlayVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setRulesVisibility = function (value) {
                try {
                    GameUI.target.setRulesVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.on = function (event, listener, scope) {
                try {
                    GameUI.target.on.call(GameUI.target, event, listener.bind(scope));
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.showCustomModal = function (styles) {
                try {
                    GameUI.target.setModalStyle(styles);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setCurrency = function (value) {
                try {
                    GameUI.target.setCurrency(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.disableUI = function () {
                try {
                    GameUI.target.disableUI(true);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.enableUI = function () {
                try {
                    GameUI.target.disableUI(false);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.disableControlBar = function () {
                try {
                    GameUI.target.disableControlBar(true);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.enableControlBar = function () {
                try {
                    GameUI.target.disableControlBar(false);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.disableMenu = function () {
                try {
                    GameUI.target.disableMenu(true);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.enableMenu = function () {
                try {
                    GameUI.target.disableMenu(false);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.disableSpinButton = function () {
                try {
                    GameUI.target.disableSpinButton(true);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.enableSpinButton = function () {
                try {
                    GameUI.target.disableSpinButton(false);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setAutoPlayCount = function (value) {
                try {
                    GameUI.target.setAutoPlayCount(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setHistoryVisibility = function (value) {
                try {
                    GameUI.target.setHistoryVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setStatisticsVisibility = function (value) {
                try {
                    GameUI.target.setStatisticsVisibility(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.backToHome = function () {
                try {
                    GameUI.target.backToHome();
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setFreeSpinMode = function (value) {
                try {
                    GameUI.target.setFreeSpinMode(value);
                }
                catch (e) {
                    console.log(e);
                }
            };
            GameUI.setFreeSpinCount = function (value) {
                try {
                    GameUI.target.freeSpinCount(value);
                }
                catch (e) {
                    console.log(e);
                }
            };
            GameUI.setColors = function (primaryColor, secondaryColor, tertiary) {
                try {
                    GameUI.target.setColors(primaryColor, secondaryColor, tertiary);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setGameValues = function (data) {
                try {
                    GameUI.target.setGameValues(data);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            GameUI.setQuickSpin = function (value) {
                try {
                    GameUI.target.setQuickSpin(value);
                }
                catch (e) {
                    console.warn(e);
                }
            };
            return GameUI;
        }());
        Essentials.GameUI = GameUI;
        var AutoPlayConditionList = (function () {
            function AutoPlayConditionList() {
                var _this = this;
                this._data = [];
                GameUI.on("autoplaycondition", function (condition) {
                    _this.update(condition.id, condition.enable, condition.value);
                }, this);
            }
            AutoPlayConditionList.prototype.add = function (id, label, type, enable, value) {
                if (type === void 0) { type = 0; }
                if (this.fetch(id))
                    throw new Error(id + " is already exist.");
                var condition = { id: id, label: label, enable: enable, type: type, value: value };
                this._data.push(condition);
                return this;
            };
            AutoPlayConditionList.prototype.remove = function (id) {
                var condition = this.fetch(id);
                if (!condition)
                    throw new Error(id + " is not exist.");
                var index = this._data.indexOf(condition);
                this._data.splice(index, 1);
                return this;
            };
            AutoPlayConditionList.prototype.update = function (id, enable, value) {
                var condition = this.fetch(id);
                if (!condition)
                    throw new Error(id + " is not exist.");
                var changed = false;
                if (condition.enable != enable) {
                    condition.enable = enable;
                    changed = true;
                }
                if (condition.enable != enable) {
                    condition.value = value;
                    changed = true;
                }
                return this;
            };
            AutoPlayConditionList.prototype.fetch = function (id) {
                var len = this._data.length;
                for (var i = 0; i < len; i++) {
                    if (this._data[i].id === id)
                        return this._data[i];
                }
                return null;
            };
            Object.defineProperty(AutoPlayConditionList.prototype, "data", {
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            AutoPlayConditionList.fromArray = function (values) {
                var instance = new AutoPlayConditionList;
                instance._data = values;
                return instance;
            };
            return AutoPlayConditionList;
        }());
        Essentials.AutoPlayConditionList = AutoPlayConditionList;
    })(Essentials = Core.Essentials || (Core.Essentials = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var Text = (function (_super) {
            __extends(Text, _super);
            function Text(x, y, text, style, parent, anchor, name) {
                if (text === void 0) { text = ""; }
                if (style === void 0) { style = { fontFamily: "Arial", fill: "#FFFFFF" }; }
                var _this = _super.call(this, text, style) || this;
                _this._zIndex = 0;
                _this._prefWidth = 0;
                _this._sizeRange = null;
                _this.position.set(x, y);
                _this._anchor.set(.5, .5);
                if (_this.name)
                    _this.name = name;
                switch (anchor) {
                    case Core.Anchor.center:
                        _this._anchor.set(.5, .5);
                        break;
                    case Core.Anchor.left:
                        _this._anchor.set(1, .5);
                        break;
                    case Core.Anchor.right:
                        _this._anchor.set(0, .5);
                        break;
                }
                parent && parent.addChild(_this);
                return _this;
            }
            Object.defineProperty(Text.prototype, "angle", {
                get: function () {
                    return Math.round(1 / ((Math.PI / 180) / this.rotation));
                },
                set: function (value) {
                    this.rotation = ((Math.PI / 180) * value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Text.prototype, "zIndex", {
                get: function () {
                    return this._zIndex;
                },
                set: function (value) {
                    this._zIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Text.prototype, "prefWidth", {
                get: function () {
                    return this._prefWidth;
                },
                set: function (value) {
                    this._prefWidth = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Text.prototype, "sizeRange", {
                get: function () {
                    return this._sizeRange;
                },
                set: function (value) {
                    this._sizeRange = value;
                },
                enumerable: true,
                configurable: true
            });
            return Text;
        }(PIXI.Text));
        Parts.Text = Text;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var BitmapText = (function (_super) {
            __extends(BitmapText, _super);
            function BitmapText(x, y, text, style, parent, anchor, name) {
                if (text === void 0) { text = ""; }
                if (style === void 0) { style = {}; }
                var _this = _super.call(this, text, style) || this;
                _this._zIndex = 0;
                _this.position.set(x, y);
                _this._anchor.set(.5, .5);
                if (_this.name)
                    _this.name = name;
                switch (anchor) {
                    case Core.Anchor.center:
                        _this._anchor.set(.5, .5);
                        break;
                    case Core.Anchor.left:
                        _this._anchor.set(1, .5);
                        break;
                    case Core.Anchor.right:
                        _this._anchor.set(0, .5);
                        break;
                }
                parent && parent.addChild(_this);
                return _this;
            }
            Object.defineProperty(BitmapText.prototype, "angle", {
                get: function () {
                    return Math.round(1 / ((Math.PI / 180) / this.rotation));
                },
                set: function (value) {
                    this.rotation = ((Math.PI / 180) * value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BitmapText.prototype, "zIndex", {
                get: function () {
                    return this._zIndex;
                },
                set: function (value) {
                    this._zIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BitmapText.prototype, "style", {
                set: function (style) {
                    this.style = style;
                },
                enumerable: true,
                configurable: true
            });
            return BitmapText;
        }(PIXI.extras.BitmapText));
        Parts.BitmapText = BitmapText;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var ButtonStates;
        (function (ButtonStates) {
            ButtonStates["Up"] = "Up";
            ButtonStates["Down"] = "Down";
            ButtonStates["Out"] = "Out";
            ButtonStates["Over"] = "Over";
        })(ButtonStates || (ButtonStates = {}));
        var TextButton = (function (_super) {
            __extends(TextButton, _super);
            function TextButton(x, y, callback, context, text, style, states, parent) {
                var _this = _super.call(this, x, y, text, style, parent) || this;
                _this._callback = null;
                _this._context = null;
                _this._state = ButtonStates.Out;
                _this._states = { out: 0xFFFFFF, over: 0xFFFFFF, down: 0xFFFFFF, disabled: 0xFFFFFF };
                _this._codes = [];
                _this._isPressed = false;
                _this._isEnabled = true;
                _this.buttonMode = true;
                _this.interactive = true;
                _this._callback = callback;
                _this._context = context;
                _this.setStates(states);
                _this.on("pointerout", _this.onButtonOut, _this);
                _this.on("pointerover", _this.onButtonOver, _this);
                _this.on("pointerdown", _this.onButtonDown, _this);
                _this.on("pointerup", _this.onButtonUp, _this);
                _this.on("pointerupoutside", _this.onButtonUpOutside, _this);
                return _this;
            }
            TextButton.prototype.setStates = function (states) {
                this._states = (typeof states === "object" && states != null) ? states : this._states;
                this.resolveButtonState(this._state);
            };
            TextButton.prototype.captureKey = function (code) {
                if (typeof this._codes === "undefined" || this._codes == null)
                    this._codes = [];
                if (this._codes.length == 0) {
                    document.addEventListener("keydown", this.onKeyDown.bind(this));
                    document.addEventListener("keyup", this.onKeyUp.bind(this));
                }
                this._codes[this._codes.length] = code;
            };
            TextButton.prototype.removeKey = function (code) {
                if (typeof this._codes === "undefined" || this._codes == null)
                    this._codes = [];
                if (this._codes.length != 0) {
                    var index = this._codes.indexOf(code);
                    this._codes.splice(((index == -1) ? this._codes.length : index), 1);
                }
            };
            TextButton.prototype.onKeyDown = function (event) {
                if (this._codes.indexOf(event.keyCode) != -1)
                    this.onButtonDown();
            };
            TextButton.prototype.onKeyUp = function (event) {
                if (this._codes.indexOf(event.keyCode) != -1)
                    this.onButtonUp(false);
            };
            TextButton.prototype.onButtonOut = function () {
                this._state = ButtonStates.Out;
                if (this._isEnabled == true) {
                    this.resolveButtonState(this._state);
                    if (this._isPressed == true)
                        this.emit("pointerup", true);
                    this._isPressed = false;
                }
            };
            TextButton.prototype.onButtonOver = function () {
                this._state = ButtonStates.Over;
                if (this._isEnabled == true)
                    this.resolveButtonState(this._state);
            };
            TextButton.prototype.onButtonDown = function () {
                if (this._isEnabled == true) {
                    this.resolveButtonState(this._state = ButtonStates.Down);
                    this._isPressed = true;
                }
            };
            TextButton.prototype.onButtonUp = function (skip) {
                if (typeof skip === "boolean" && skip == true)
                    return;
                if (this._isEnabled == true && this._isPressed == true) {
                    switch (skip) {
                        case false:
                            this.resolveButtonState(this._state = ButtonStates.Out);
                            break;
                        default:
                            this.resolveButtonState(this._state = ButtonStates.Up);
                    }
                    this._isPressed = false;
                    if (this._callback && this._context)
                        this._callback.call(this._context, this);
                }
            };
            TextButton.prototype.onButtonUpOutside = function () {
                if (this._isEnabled == true && this._isPressed == true)
                    this.resolveButtonState(this._state = ButtonStates.Out);
            };
            TextButton.prototype.resolveButtonState = function (buttonState) {
                var currentState = null;
                switch (this.isEnabled) {
                    case true:
                        switch (buttonState) {
                            case ButtonStates.Up:
                                currentState = this._states.over;
                                break;
                            case ButtonStates.Down:
                                currentState = this._states.down;
                                break;
                            case ButtonStates.Out:
                                currentState = this._states.out;
                                break;
                            case ButtonStates.Over:
                                currentState = this._states.over;
                                break;
                        }
                        break;
                    case false:
                        currentState = this._states.disabled;
                        break;
                }
                if (currentState != null) {
                    switch (typeof currentState) {
                        case "number":
                            this.tint = currentState;
                            break;
                        case "object":
                            for (var property in currentState)
                                this.style[property] = currentState[property];
                            break;
                    }
                }
            };
            Object.defineProperty(TextButton.prototype, "isEnabled", {
                get: function () {
                    return this._isEnabled;
                },
                set: function (value) {
                    if (this._isEnabled != value) {
                        this._isEnabled = value;
                        this.buttonMode = value;
                        this.interactive = value;
                        this.resolveButtonState(this._state);
                        if (this._isPressed == true) {
                            this._isPressed = false;
                            this.emit("pointerup", true);
                            this._state = ButtonStates.Out;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextButton.prototype, "state", {
                get: function () {
                    return this._state;
                },
                enumerable: true,
                configurable: true
            });
            return TextButton;
        }(Parts.Text));
        Parts.TextButton = TextButton;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var ButtonStates;
        (function (ButtonStates) {
            ButtonStates["Up"] = "Up";
            ButtonStates["Down"] = "Down";
            ButtonStates["Out"] = "Out";
            ButtonStates["Over"] = "Over";
        })(ButtonStates || (ButtonStates = {}));
        var BitmapTextButton = (function (_super) {
            __extends(BitmapTextButton, _super);
            function BitmapTextButton(x, y, callback, context, text, style, states, parent) {
                var _this = _super.call(this, x, y, text, style, parent) || this;
                _this._callback = null;
                _this._context = null;
                _this._state = ButtonStates.Out;
                _this._states = { out: 0xFFFFFF, over: 0xFFFFFF, down: 0xFFFFFF, disabled: 0xFFFFFF };
                _this._codes = [];
                _this._isPressed = false;
                _this._isEnabled = true;
                _this.buttonMode = true;
                _this.interactive = true;
                _this._state = ButtonStates.Out;
                _this._callback = callback;
                _this._context = context;
                _this.setStates(states);
                _this.on("pointerout", _this.onButtonOut, _this);
                _this.on("pointerover", _this.onButtonOver, _this);
                _this.on("pointerdown", _this.onButtonDown, _this);
                _this.on("pointerup", _this.onButtonUp, _this);
                _this.on("pointerupoutside", _this.onButtonUpOutside, _this);
                return _this;
            }
            BitmapTextButton.prototype.setStates = function (states) {
                this._states = (typeof states === "object" && states != null) ? states : this._states;
                this.resolveButtonState(this._state);
            };
            BitmapTextButton.prototype.captureKey = function (code) {
                if (typeof this._codes === "undefined" || this._codes == null)
                    this._codes = [];
                if (this._codes.length == 0) {
                    document.addEventListener("keydown", this.onKeyDown.bind(this));
                    document.addEventListener("keyup", this.onKeyUp.bind(this));
                }
                this._codes[this._codes.length] = code;
            };
            BitmapTextButton.prototype.removeKey = function (code) {
                if (typeof this._codes === "undefined" || this._codes == null)
                    this._codes = [];
                if (this._codes.length != 0) {
                    var index = this._codes.indexOf(code);
                    this._codes.splice(((index == -1) ? this._codes.length : index), 1);
                }
            };
            BitmapTextButton.prototype.onKeyDown = function (event) {
                if (this._codes.indexOf(event.keyCode) != -1)
                    this.onButtonDown();
            };
            BitmapTextButton.prototype.onKeyUp = function (event) {
                if (this._codes.indexOf(event.keyCode) != -1)
                    this.onButtonUp(false);
            };
            BitmapTextButton.prototype.onButtonOut = function () {
                this._state = ButtonStates.Out;
                if (this._isEnabled == true) {
                    this.resolveButtonState(this._state);
                    if (this._isPressed == true)
                        this.emit("pointerup", true);
                    this._isPressed = false;
                }
            };
            BitmapTextButton.prototype.onButtonOver = function () {
                this._state = ButtonStates.Over;
                if (this._isEnabled == true)
                    this.resolveButtonState(this._state);
            };
            BitmapTextButton.prototype.onButtonDown = function () {
                if (this._isEnabled == true) {
                    this.resolveButtonState(this._state = ButtonStates.Down);
                    this._isPressed = true;
                }
            };
            BitmapTextButton.prototype.onButtonUp = function (skip) {
                if (typeof skip === "boolean" && skip == true)
                    return;
                if (this._isEnabled == true && this._isPressed == true) {
                    switch (skip) {
                        case false:
                            this.resolveButtonState(this._state = ButtonStates.Out);
                            break;
                        default:
                            this.resolveButtonState(this._state = ButtonStates.Up);
                    }
                    this._isPressed = false;
                    if (this._callback && this._context)
                        this._callback.call(this._context, this);
                }
            };
            BitmapTextButton.prototype.onButtonUpOutside = function () {
                if (this._isEnabled == true && this._isPressed == true)
                    this.resolveButtonState(this._state = ButtonStates.Out);
            };
            BitmapTextButton.prototype.resolveButtonState = function (buttonState) {
                switch (this.isEnabled) {
                    case true:
                        switch (buttonState) {
                            case ButtonStates.Up:
                                this.tint = this._states.over;
                                break;
                            case ButtonStates.Down:
                                this.tint = this._states.down;
                                break;
                            case ButtonStates.Out:
                                this.tint = this._states.out;
                                break;
                            case ButtonStates.Over:
                                this.tint = this._states.over;
                                break;
                        }
                        break;
                    case false:
                        this.tint = this._states.disabled;
                        break;
                }
            };
            Object.defineProperty(BitmapTextButton.prototype, "isEnabled", {
                get: function () {
                    return this._isEnabled;
                },
                set: function (value) {
                    if (this._isEnabled != value) {
                        this._isEnabled = value;
                        this.buttonMode = value;
                        this.interactive = value;
                        this.resolveButtonState(this._state);
                        if (this._isPressed == true) {
                            this._isPressed = false;
                            this.emit("pointerup", true);
                            this._state = ButtonStates.Out;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BitmapTextButton.prototype, "state", {
                get: function () {
                    return this._state;
                },
                enumerable: true,
                configurable: true
            });
            return BitmapTextButton;
        }(Parts.BitmapText));
        Parts.BitmapTextButton = BitmapTextButton;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Essentials;
    (function (Essentials) {
        ;
        ;
        ;
        var Language = (function (_super) {
            __extends(Language, _super);
            function Language(game) {
                var _this = _super.call(this) || this;
                _this._loader = new XMLHttpRequest();
                _this._langNumber = 0;
                _this._langUrls = [];
                _this._bmpFontLoaded = false;
                _this._webFontLoaded = false;
                _this.game = game;
                _this._loader.addEventListener("error", _this.onJsonLoadError.bind(_this), false);
                _this._loader.addEventListener("abort", _this.onJsonLoadError.bind(_this), false);
                _this._loader.addEventListener("timeout", _this.onJsonLoadError.bind(_this), false);
                _this._loader.addEventListener("load", _this.onJsonLoadComplete.bind(_this), false);
                return _this;
            }
            Language.prototype.load = function (langUrls) {
                if (typeof langUrls === "undefined" || langUrls == null || langUrls.length == 0)
                    return;
                this._langNumber = 0;
                this._langUrls = langUrls;
                this._loader.open("GET", this._langUrls[this._langNumber++], true);
                this._loader.send(null);
            };
            Language.prototype.createText = function (key, x, y, text, style, parent, anchor) {
                if (text === void 0) { text = null; }
                var data = this._manifest.data[key];
                if (typeof data === "undefined" || typeof data.properties === "undefined")
                    return new Core.Parts.Text(x, y, key, style, parent);
                text = (typeof text === "string") ? text : this.parse(key);
                style = (typeof style === "object" && style != null) ? this.style(key, style) : this.style(key);
                var type = (data.properties.font in this.font) ? this.font[data.properties.font].type.toLowerCase() : "webfont";
                switch (type) {
                    case "bitmapfont":
                        return new Core.Parts.BitmapText(x, y, text, style, parent, anchor);
                    case "webfont":
                    default:
                        return new Core.Parts.Text(x, y, text, style, parent, anchor);
                }
            };
            Language.prototype.createButton = function (key, x, y, callback, context, text, style, states, parent) {
                if (text === void 0) { text = null; }
                var data = this._manifest.data[key];
                if (typeof data === "undefined" || typeof data.properties === "undefined")
                    return new Core.Parts.TextButton(x, y, callback, context, key, style, states, parent);
                text = (typeof text === "string") ? text : this.parse(key);
                style = (typeof style === "object" && style != null) ? this.style(key, style) : this.style(key);
                var type = (data.properties.font in this.font) ? this.font[data.properties.font].type.toLowerCase() : "webfont";
                switch (type) {
                    case "bitmapfont":
                        return new Core.Parts.BitmapTextButton(x, y, callback, context, text, style, states, parent);
                    case "webfont":
                    default:
                        return new Core.Parts.TextButton(x, y, callback, context, text, style, states, parent);
                }
            };
            Language.prototype.parse = function (key) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var text = "";
                var data = this._manifest.data[key];
                if (typeof data === "undefined" || typeof data.text === "undefined")
                    return key;
                text = data.text.replace(new RegExp('\\|\\{\\d+\\}|\\{(\\d+)\\}', 'gm'), function (substr, i) {
                    switch (substr[0]) {
                        case "|":
                            return substr.slice(1, substr.length);
                        default:
                            return (typeof args[i] !== "undefined" && args[i] != null) ? args[i] : substr;
                    }
                });
                return text;
            };
            Language.prototype.style = function (key, style) {
                if (style === void 0) { style = {}; }
                var data = this._manifest.data[key];
                if (typeof data === "undefined" || typeof data.properties === "undefined")
                    return style;
                style.font = { name: data.properties.font, size: (typeof style.size !== "undefined") ? style.size : 15 };
                style.tint = (typeof style.tint !== "undefined") ? style.tint : 0xFFFFFF;
                style.fontFamily = (typeof style.fontFamily !== "undefined") ? style.fontFamily : "Arial";
                style.fontSize = (typeof style.fontSize !== "undefined") ? style.fontSize : 15;
                style.fill = (typeof style.fill !== "undefined") ? style.fill : "#FFFFFF";
                style.align = (typeof style.align !== "undefined") ? style.align : "left";
                var font = data.properties.font;
                var type = (font in this.font) ? this.font[font].type.toLowerCase() : "webfont";
                switch (type) {
                    case "webfont":
                        delete style.font;
                        delete style.tint;
                        style.fontFamily = (typeof data.properties.font !== "undefined") ? data.properties.font : style.fontFamily;
                        style.fontSize = (typeof data.properties.size !== "undefined") ? data.properties.size : style.fontSize;
                        style.fill = (typeof data.properties.fill !== "undefined") ? data.properties.fill : style.fill;
                        style.align = (typeof data.properties.align !== "undefined") ? data.properties.align : style.align;
                        break;
                    case "bitmapfont":
                        delete style.fontFamily;
                        delete style.fontSize;
                        delete style.fill;
                        style.font.name = (typeof data.properties.font !== "undefined") ? data.properties.font : style.font.name;
                        style.font.size = (typeof data.properties.size !== "undefined") ? data.properties.size : style.font.size;
                        style.tint = (typeof data.properties.fill !== "undefined") ? parseInt(data.properties.fill) : style.tint;
                        style.align = (typeof data.properties.align !== "undefined") ? data.properties.align : style.align;
                        break;
                }
                return style;
            };
            Language.prototype.onJsonLoadComplete = function () {
                switch (this._loader.status) {
                    case 200:
                        try {
                            this._manifest = JSON.parse(this._loader.responseText);
                            if (this._manifest.code == 404) {
                                if (this._langUrls.length == this._langNumber) {
                                    this.emit("loaderror", this, this._loader);
                                    return;
                                }
                                this._loader.open("GET", this._langUrls[this._langNumber++], true);
                                this._loader.send(null);
                                return;
                            }
                            this._bmpFontLoaded = false;
                            this._webFontLoaded = false;
                            switch (Object.keys(this.bitmapfont).length) {
                                case 0:
                                    this._bmpFontLoaded = true;
                                    break;
                                default:
                                    this.game.resource.reset(false, true);
                                    for (var font in this.bitmapfont) {
                                        if (typeof this.bitmapfont[font].url === "string")
                                            this.game.resource.addTexture(font, this.bitmapfont[font].url);
                                    }
                                    this.game.resource.once("loadcomplete", this.onBitmapFontLoadComplete, this);
                                    this.game.resource.once("loaderror", this.onBitmapFontLoadError, this);
                                    this.game.resource.load();
                                    break;
                            }
                            switch (Object.keys(this.webfont).length) {
                                case 0:
                                    this._webFontLoaded = true;
                                    break;
                                default:
                                    var fams = [];
                                    var urls = [];
                                    for (var font in this.webfont) {
                                        var format = "";
                                        if (typeof this.webfont[font].format !== "undefined")
                                            format = this.webfont[font].format;
                                        fams.push((font + ":" + format));
                                        if (urls.indexOf(this.webfont[font].url) == -1)
                                            urls.push(this.webfont[font].url);
                                    }
                                    WebFont.load({
                                        custom: { families: fams, urls: urls },
                                        active: this.onWebFontLoadComplete.bind(this),
                                        inactive: this.onWebFontLoadError.bind(this)
                                    });
                                    break;
                            }
                        }
                        catch (e) {
                            this.emit("loaderror", this, this._loader.responseText);
                        }
                        break;
                    case 404:
                    case 500:
                        if (this._langUrls.length == this._langNumber) {
                            this.emit("loaderror", this, this._loader);
                            return;
                        }
                        this._loader.open("GET", this._langUrls[this._langNumber++], true);
                        this._loader.send(null);
                        break;
                    default:
                        this.emit("loaderror", this, this._loader);
                        break;
                }
            };
            Language.prototype.onJsonLoadError = function () {
                this.emit("loaderror", this, this._loader);
            };
            Language.prototype.onBitmapFontLoadComplete = function () {
                this._bmpFontLoaded = true;
                if (this._webFontLoaded == true)
                    this.emit("loadcomplete", this, this._manifest);
            };
            Language.prototype.onBitmapFontLoadError = function () {
                this.emit("loaderror", this, this._manifest);
            };
            Language.prototype.onWebFontLoadComplete = function () {
                this._webFontLoaded = true;
                if (this._bmpFontLoaded == true)
                    this.emit("loadcomplete", this, this._manifest);
            };
            Language.prototype.onWebFontLoadError = function () {
                this.emit("loaderror", this, this._manifest);
            };
            Object.defineProperty(Language.prototype, "manifest", {
                get: function () {
                    return this._manifest;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Language.prototype, "code", {
                get: function () {
                    return this._manifest.code;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Language.prototype, "font", {
                get: function () {
                    return this._manifest.font;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Language.prototype, "webfont", {
                get: function () {
                    var font = {};
                    if (typeof this.font === "undefined" || this.font == null)
                        return font;
                    for (var key in this.font) {
                        if (this.font[key].type.toLowerCase() == "webfont")
                            font[key] = this.font[key];
                    }
                    return font;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Language.prototype, "bitmapfont", {
                get: function () {
                    var font = {};
                    if (typeof this.font === "undefined" || this.font == null)
                        return font;
                    for (var key in this.font) {
                        if (this.font[key].type.toLowerCase() == "bitmapfont")
                            font[key] = this.font[key];
                    }
                    return font;
                },
                enumerable: true,
                configurable: true
            });
            return Language;
        }(PIXI.utils.EventEmitter));
        Essentials.Language = Language;
    })(Essentials = Core.Essentials || (Core.Essentials = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Essentials;
    (function (Essentials) {
        var PING_INTERVAL = 30000;
        var Service = (function (_super) {
            __extends(Service, _super);
            function Service(config) {
                var _this = _super.call(this) || this;
                _this._pingMS = 0;
                _this._mSendTime = 0;
                _this._pSendTime = 0;
                _this._config = config;
                return _this;
            }
            Service.prototype.connect = function () {
                if ((typeof this._config.conId !== "string" || this._config.conId.length != 32) &&
                    (typeof this._config.debug === "boolean" && this._config.debug == true)) {
                    this._xInstance = new XMLHttpRequest();
                    this._xInstance.addEventListener("error", this.onConnectionIdError.bind(this), false);
                    this._xInstance.addEventListener("abort", this.onConnectionIdError.bind(this), false);
                    this._xInstance.addEventListener("timeout", this.onConnectionIdError.bind(this), false);
                    this._xInstance.addEventListener("load", this.onConnectionIdLoad.bind(this), false);
                    var url = this._config.conUrl;
                    var user = this._config.conUser;
                    var code = this._config.gameCode;
                    this._xInstance.open("GET", (url + "?username=" + user + "&gameId=" + String(code)), true);
                    this._xInstance.send(null);
                    return;
                }
                var protocol = this._config.protocol;
                var hostname = this._config.hostname;
                var port = String(this._config.port);
                this.establish((protocol + "://" + hostname + ":" + port));
            };
            Service.prototype.send = function (action, parameters) {
                if (parameters === void 0) { parameters = {}; }
                parameters.action = action;
                parameters.conId = this._config.conId;
                parameters.gameId = this._config.gameId;
                parameters.I = "0000";
                this._wInstance.send(JSON.stringify(parameters));
                this._mSendTime = Date.now();
            };
            Service.prototype.establish = function (url) {
                this._wInstance = new WebSocket(url);
                this._wInstance.onopen = this.onWebSocketOpen.bind(this);
                this._wInstance.onclose = this.onWebSocketClose.bind(this);
                this._wInstance.onerror = this.onWebSocketError.bind(this);
                this._wInstance.onmessage = this.onWebSocketMessage.bind(this);
            };
            Service.prototype.calculatePing = function (value) {
                this.pingMS = (Date.now() - value);
            };
            Service.prototype.onConnectionIdError = function (event) {
                this.emit("error", "XMLHttpRequest", event);
            };
            Service.prototype.onConnectionIdLoad = function () {
                switch (this._xInstance.status) {
                    case 200:
                        this._config.conId = this._xInstance.response;
                        var protocol = this._config.protocol;
                        var hostname = this._config.hostname;
                        var port = String(this._config.port);
                        this.establish((protocol + "://" + hostname + ":" + port));
                        break;
                    default:
                        this.emit("error", "XMLHttpRequest", event);
                        break;
                }
            };
            Service.prototype.onWebSocketMessage = function (message) {
                var response = { status: false };
                try {
                    response = JSON.parse(message.data);
                }
                catch (exception) {
                    this.emit("error", "Parse", exception.message, exception);
                    return;
                }
                switch (response.status) {
                    case true:
                        switch (response.data.action) {
                            case "pong":
                                this.calculatePing(this._pSendTime);
                                break;
                            default:
                                this.emit("response", response.data);
                                this.calculatePing(this._mSendTime);
                                break;
                        }
                        break;
                    case false:
                        this.emit("error", "Status", response.type, response.message, response.code);
                        break;
                }
            };
            Service.prototype.onWebSocketError = function (event) {
                this.emit("error", "WebSocket", event);
            };
            Service.prototype.onWebSocketClose = function (event) {
                this.emit("close", event);
            };
            Service.prototype.onWebSocketOpen = function (event) {
                this.emit("open", event);
                this.once("response", this.onInitMessageReceived, this);
                this.send("init", { platform: this._config.platform });
            };
            Service.prototype.onInitMessageReceived = function (data) {
                switch (data.clientAction) {
                    case "init":
                        this.emit("init", data);
                        setInterval(this.pingCallback.bind(this), PING_INTERVAL);
                        break;
                }
            };
            Service.prototype.pingCallback = function () {
                this._wInstance.send(JSON.stringify({ action: "ping", conId: this._config.conId }));
                this._pSendTime = Date.now();
            };
            Object.defineProperty(Service.prototype, "pingMS", {
                get: function () {
                    return this._pingMS;
                },
                set: function (value) {
                    if (this._pingMS != value) {
                        this._pingMS = value;
                        this.emit("ping", value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Service.prototype, "config", {
                get: function () {
                    return this._config;
                },
                enumerable: true,
                configurable: true
            });
            return Service;
        }(PIXI.utils.EventEmitter));
        Essentials.Service = Service;
    })(Essentials = Core.Essentials || (Core.Essentials = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Essentials;
    (function (Essentials) {
        var Ticker = (function () {
            function Ticker(autoStart) {
                if (autoStart === void 0) { autoStart = true; }
                this._ticker = new PIXI.ticker.Ticker();
                this._tickerEvents = [];
                this._ticker.add(this.onTickCallback, this);
                if (autoStart == true)
                    this._ticker.start();
            }
            Ticker.prototype.start = function () {
                this._ticker.start();
            };
            Ticker.prototype.stop = function () {
                this._ticker.stop();
            };
            Ticker.prototype.addLoop = function (callback, context, isEnabled) {
                if (isEnabled === void 0) { isEnabled = true; }
                var tickerEvent = new TickerEvent(callback, context, isEnabled);
                this._tickerEvents.push(tickerEvent);
                return tickerEvent;
            };
            Ticker.prototype.remove = function (target) {
                if (target && typeof target === "function") {
                    for (var tIndex = 0; tIndex < this._tickerEvents.length; tIndex++) {
                        if (this._tickerEvents[tIndex].callback == target)
                            this._tickerEvents.splice(tIndex, 1);
                    }
                }
                else if (target)
                    this._tickerEvents.splice(this._tickerEvents.indexOf(target), 1);
            };
            Ticker.prototype.removeAll = function () {
                delete this._tickerEvents;
                this._tickerEvents = [];
            };
            Ticker.prototype.onTickCallback = function () {
                for (var index = 0; index < this._tickerEvents.length; index++) {
                    if (this._tickerEvents[index].isEnabled == true)
                        this._tickerEvents[index].callback.call(this._tickerEvents[index].context, this._ticker.elapsedMS, this._ticker.deltaTime);
                }
            };
            return Ticker;
        }());
        Essentials.Ticker = Ticker;
        var TickerEvent = (function () {
            function TickerEvent(callback, context, isEnabled) {
                if (isEnabled === void 0) { isEnabled = true; }
                this._callback = callback;
                this._context = context;
                this._isEnabled = isEnabled;
            }
            Object.defineProperty(TickerEvent.prototype, "callback", {
                get: function () {
                    return this._callback;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TickerEvent.prototype, "context", {
                get: function () {
                    return this._context;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TickerEvent.prototype, "isEnabled", {
                get: function () {
                    return this._isEnabled;
                },
                set: function (value) {
                    if (this._isEnabled != value)
                        this._isEnabled = value;
                },
                enumerable: true,
                configurable: true
            });
            return TickerEvent;
        }());
        Essentials.TickerEvent = TickerEvent;
    })(Essentials = Core.Essentials || (Core.Essentials = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Essentials;
    (function (Essentials) {
        var Timer = (function () {
            function Timer(isEnabled) {
                if (isEnabled === void 0) { isEnabled = true; }
                this._timerEvents = [];
                this._isEnabled = true;
                this._isEnabled = isEnabled;
            }
            Timer.prototype.addTimeout = function (duration, callback, context, autoStart) {
                if (autoStart === void 0) { autoStart = true; }
                var args = [];
                for (var _i = 4; _i < arguments.length; _i++) {
                    args[_i - 4] = arguments[_i];
                }
                var timerEvent = new (TimerEvent.bind.apply(TimerEvent, [void 0, duration, callback, context, false, autoStart].concat(args)))();
                this._timerEvents.push(timerEvent);
                return timerEvent;
            };
            Timer.prototype.addInterval = function (duration, callback, context, autoStart) {
                if (autoStart === void 0) { autoStart = true; }
                var args = [];
                for (var _i = 4; _i < arguments.length; _i++) {
                    args[_i - 4] = arguments[_i];
                }
                var timerEvent = new (TimerEvent.bind.apply(TimerEvent, [void 0, duration, callback, context, true, autoStart].concat(args)))();
                this._timerEvents.push(timerEvent);
                return timerEvent;
            };
            Timer.prototype.remove = function (target) {
                if (target && typeof target === "function") {
                    for (var tIndex = 0; tIndex < this._timerEvents.length; tIndex++) {
                        if (this._timerEvents[tIndex].callback == target)
                            this._timerEvents.splice(tIndex, 1);
                    }
                }
                else if (target)
                    this._timerEvents.splice(this._timerEvents.indexOf(target), 1);
            };
            Timer.prototype.removeAll = function () {
                delete this._timerEvents;
                this._timerEvents = [];
            };
            Timer.prototype.update = function (elapsedMS, deltaTime) {
                if (this._isEnabled == true) {
                    var elapsed = (elapsedMS / 1000);
                    for (var tIndex = 0; tIndex < this._timerEvents.length; tIndex++) {
                        if (this._timerEvents[tIndex] && this._timerEvents[tIndex].isActive == true) {
                            if (this._timerEvents[tIndex].elapsed >= this._timerEvents[tIndex].duration) {
                                if (this._timerEvents[tIndex].isInterval == true) {
                                    this._timerEvents[tIndex].elapsed = elapsed;
                                    (_a = this._timerEvents[tIndex].callback).call.apply(_a, [this._timerEvents[tIndex].context].concat(this._timerEvents[tIndex].arguments, [this._timerEvents[tIndex]]));
                                }
                                else {
                                    var oldTimerEvents = this._timerEvents.splice(tIndex, 1);
                                    for (var oIndex = 0; oIndex < oldTimerEvents.length; oIndex++)
                                        (_b = oldTimerEvents[oIndex].callback).call.apply(_b, [oldTimerEvents[oIndex].context].concat(oldTimerEvents[oIndex].arguments, [oldTimerEvents[oIndex]]));
                                    oldTimerEvents = null;
                                }
                            }
                            else
                                this._timerEvents[tIndex].elapsed += elapsed;
                        }
                    }
                }
                var _a, _b;
            };
            Object.defineProperty(Timer.prototype, "isEnabled", {
                get: function () {
                    return this._isEnabled;
                },
                set: function (value) {
                    if (this._isEnabled != value)
                        this._isEnabled = value;
                },
                enumerable: true,
                configurable: true
            });
            return Timer;
        }());
        Essentials.Timer = Timer;
        var TimerEvent = (function () {
            function TimerEvent(duration, callback, context, isInterval, isActive) {
                if (isInterval === void 0) { isInterval = false; }
                if (isActive === void 0) { isActive = false; }
                var args = [];
                for (var _i = 5; _i < arguments.length; _i++) {
                    args[_i - 5] = arguments[_i];
                }
                this._duration = duration;
                this._elapsed = 0;
                this._callback = callback;
                this._context = context;
                this._isInterval = isInterval;
                this._isActive = isActive;
                this._arguments = args;
            }
            TimerEvent.prototype.start = function () {
                this.elapsed = 0;
                this.isActive = true;
            };
            TimerEvent.prototype.stop = function () {
                this.elapsed = 0;
                this.isActive = false;
            };
            TimerEvent.prototype.resume = function () {
                this.isActive = true;
            };
            TimerEvent.prototype.pause = function () {
                this.isActive = false;
            };
            Object.defineProperty(TimerEvent.prototype, "callback", {
                get: function () {
                    return this._callback;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimerEvent.prototype, "context", {
                get: function () {
                    return this._context;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimerEvent.prototype, "duration", {
                get: function () {
                    return this._duration;
                },
                set: function (value) {
                    if (this._duration != value)
                        this._duration = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimerEvent.prototype, "elapsed", {
                get: function () {
                    return this._elapsed;
                },
                set: function (value) {
                    if (this._elapsed != value)
                        this._elapsed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimerEvent.prototype, "isInterval", {
                get: function () {
                    return this._isInterval;
                },
                set: function (value) {
                    if (this._isInterval != value)
                        this._isInterval = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimerEvent.prototype, "isActive", {
                get: function () {
                    return this._isActive;
                },
                set: function (value) {
                    if (this._isActive != value)
                        this._isActive = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimerEvent.prototype, "arguments", {
                get: function () {
                    return this._arguments;
                },
                enumerable: true,
                configurable: true
            });
            return TimerEvent;
        }());
        Essentials.TimerEvent = TimerEvent;
    })(Essentials = Core.Essentials || (Core.Essentials = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Filters;
    (function (Filters) {
        var GrayFilter = (function (_super) {
            __extends(GrayFilter, _super);
            function GrayFilter(gray) {
                if (gray === void 0) { gray = 1; }
                var _this = this;
                var fragmentSrcData = "precision mediump float;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "varying vec4 vColor;\n" +
                    "uniform sampler2D uSampler;\n" +
                    "uniform float gray;\n" +
                    "void main(void) {\n" +
                    "   gl_FragColor = texture2D(uSampler, vTextureCoord);\n" +
                    "   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);\n" +
                    "}";
                _this = _super.call(this, null, fragmentSrcData, { gray: { type: "1f", value: gray } }) || this;
                return _this;
            }
            return GrayFilter;
        }(PIXI.Filter));
        Filters.GrayFilter = GrayFilter;
    })(Filters = Core.Filters || (Core.Filters = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Filters;
    (function (Filters) {
        var InvertFilter = (function (_super) {
            __extends(InvertFilter, _super);
            function InvertFilter(invert) {
                if (invert === void 0) { invert = 0; }
                var _this = this;
                var fragmentSrcData = "precision mediump float;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "uniform float invert;\n" +
                    "uniform sampler2D uSampler;\n" +
                    "void main(void) {\n" +
                    "   gl_FragColor = texture2D(uSampler, vTextureCoord);\n" +
                    "   gl_FragColor.rgb = mix((vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, (1.0 - invert));\n" +
                    "   gl_FragColor.rgb = gl_FragColor.rgb * gl_FragColor.a;\n" +
                    "}";
                _this = _super.call(this, null, fragmentSrcData, { invert: { type: "1f", value: invert } }) || this;
                return _this;
            }
            return InvertFilter;
        }(PIXI.Filter));
        Filters.InvertFilter = InvertFilter;
    })(Filters = Core.Filters || (Core.Filters = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Filters;
    (function (Filters) {
        var ToneFilter = (function (_super) {
            __extends(ToneFilter, _super);
            function ToneFilter(tone) {
                if (tone === void 0) { tone = 0; }
                var _this = this;
                var fragmentSrcData = "precision mediump float;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "uniform float tone;\n" +
                    "uniform sampler2D uSampler;\n" +
                    "void main(void) {\n" +
                    "   gl_FragColor = texture2D(uSampler, vTextureCoord);\n" +
                    "   gl_FragColor.rgb = gl_FragColor.rgb * (1.0 - tone);\n" +
                    "}";
                _this = _super.call(this, null, fragmentSrcData, { tone: { type: "1f", value: tone } }) || this;
                return _this;
            }
            return ToneFilter;
        }(PIXI.Filter));
        Filters.ToneFilter = ToneFilter;
    })(Filters = Core.Filters || (Core.Filters = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Version = (function () {
        function Version() {
            this.clientVersion = "test";
        }
        return Version;
    }());
    Core.Version = Version;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(config, container, fullscreen) {
            var _this = _super.call(this) || this;
            Game._instance = _this;
            _this._display = new Core.Managers.DisplayManager(_this, Core.DisplayResolution.width, Core.DisplayResolution.height, config.options, container, fullscreen);
            _this._resource = new Core.Managers.ResourceManager(config.service.cdnUrl);
            _this._language = new Core.Essentials.Language(_this);
            _this._stage = new Core.Managers.StageManager(_this);
            _this._sound = new Core.Managers.SoundManager(_this.resource["_sounds"]["default"]);
            _this._service = new Core.Essentials.Service(config.service);
            _this._data = new Core.Essentials.Database();
            _this._timer = new Core.Essentials.Timer();
            _this._ticker = new Core.Essentials.Ticker();
            _this._ticker.addLoop(function (elapsedMS, deltaTime) {
                _this._timer.update(elapsedMS, deltaTime);
                _this._stage.update(elapsedMS, deltaTime);
                _this._display.render(_this._stage.container);
            }, _this, true);
            _this._config = config;
            _this._dataController = new Core.Controller.DataController();
            _this._resourceController = new Core.Singleton.ResourceController();
            _this._stage.start("AssetLoader", Core.Stages.AssetLoader, false, false);
            return _this;
        }
        Object.defineProperty(Game, "instance", {
            get: function () {
                return Game._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "display", {
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "resource", {
            get: function () {
                return this._resource;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "stage", {
            get: function () {
                return this._stage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "sound", {
            get: function () {
                return this._sound;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "service", {
            get: function () {
                return this._service;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "language", {
            get: function () {
                return this._language;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "timer", {
            get: function () {
                return this._timer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "ticker", {
            get: function () {
                return this._ticker;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "config", {
            get: function () {
                return this._config;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "ResourceController", {
            get: function () {
                return this._resourceController;
            },
            enumerable: true,
            configurable: true
        });
        return Game;
    }(Core.Version));
    Core.Game = Game;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Loaders;
    (function (Loaders) {
        var SoundLoader = (function (_super) {
            __extends(SoundLoader, _super);
            function SoundLoader() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._resources = {};
                _this._loadingCount = 0;
                _this._loadingProgress = 0;
                _this._isLoading = false;
                return _this;
            }
            SoundLoader.prototype.add = function (key, channel, src) {
                if ((key in this._resources) == false) {
                    this._resources[key] = {
                        sound: new Howl({ src: src, loop: false, volume: 1, preload: false, autoplay: false }),
                        channel: channel,
                        isSoundMuted: false,
                        isChannelMuted: false
                    };
                    this._resources[key].sound.once("load", this.onSoundLoadProgress.bind(this, this._resources[key].sound, key));
                    this._resources[key].sound.once("loaderror", this.onSoundLoadError.bind(this, this._resources[key].sound, key));
                    this.emit("soundcreate", this._resources[key].sound, key);
                }
                else
                    throw "Error: The key already exists in cache.";
            };
            SoundLoader.prototype.remove = function (key) {
                if ((key in this._resources) == true) {
                    this._resources[key].sound.unload();
                    delete this._resources[key];
                }
            };
            SoundLoader.prototype.reset = function () {
                for (var sound in this._resources)
                    this._resources[sound].sound.unload();
                this._resources = {};
                this._loadingCount = 0;
                this._loadingProgress = 0;
                this._isLoading = false;
            };
            SoundLoader.prototype.load = function () {
                if (Object.keys(this._resources).length > 0) {
                    this._loadingCount = 0;
                    this._loadingProgress = 0;
                    this._isLoading = true;
                    this.emit("start", this);
                    for (var sound in this._resources)
                        this._resources[sound].sound.load();
                }
            };
            SoundLoader.prototype.onSoundLoadProgress = function (sound, key) {
                this._loadingCount += 1;
                this._loadingProgress = Math.floor((100 / Object.keys(this._resources).length) * this._loadingCount);
                this.emit("progress", this, sound, key);
                if (this._loadingCount == Object.keys(this._resources).length) {
                    this._isLoading = false;
                    this.emit("complete", this, sound, key);
                }
            };
            SoundLoader.prototype.onSoundLoadError = function (sound, key) {
                this.emit("error", this, sound, key);
            };
            Object.defineProperty(SoundLoader.prototype, "isLoading", {
                get: function () {
                    return this._isLoading;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SoundLoader.prototype, "loadingProgress", {
                get: function () {
                    return this._loadingProgress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SoundLoader.prototype, "loadingCount", {
                get: function () {
                    return this._loadingCount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SoundLoader.prototype, "resources", {
                get: function () {
                    return this._resources;
                },
                enumerable: true,
                configurable: true
            });
            return SoundLoader;
        }(PIXI.utils.EventEmitter));
        Loaders.SoundLoader = SoundLoader;
    })(Loaders = Core.Loaders || (Core.Loaders = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Managers;
    (function (Managers) {
        var RendererType;
        (function (RendererType) {
            RendererType[RendererType["Canvas"] = 0] = "Canvas";
            RendererType[RendererType["WebGL"] = 1] = "WebGL";
            RendererType[RendererType["Auto"] = 2] = "Auto";
        })(RendererType = Managers.RendererType || (Managers.RendererType = {}));
        var PositionType;
        (function (PositionType) {
            PositionType[PositionType["PositionXForLandscape"] = 0] = "PositionXForLandscape";
            PositionType[PositionType["PositionXForPortrait"] = 1] = "PositionXForPortrait";
            PositionType[PositionType["PositionYForLandscape"] = 2] = "PositionYForLandscape";
            PositionType[PositionType["PositionYForPortrait"] = 3] = "PositionYForPortrait";
        })(PositionType = Managers.PositionType || (Managers.PositionType = {}));
        var DisplayManager = (function (_super) {
            __extends(DisplayManager, _super);
            function DisplayManager(game, width, height, options, container, target) {
                if (options === void 0) { options = {}; }
                var _this = _super.call(this) || this;
                _this._renderTargets = [];
                _this._rendererContainer = null;
                _this._fullscreenTarget = null;
                _this.to = 0;
                _this._orientation = "potrait";
                _this.game = game;
                _this._renderer = new PIXI.WebGLRenderer(width, height, options);
                _this.initProperties(container, target);
                return _this;
            }
            DisplayManager.prototype.render = function (stageContainer) {
                for (var rIndex = 0; rIndex < this._renderTargets.length; rIndex++)
                    this._renderer.render(this._renderTargets[rIndex].rDisplay, this._renderTargets[rIndex].rTexture);
                if (typeof stageContainer !== "undefined" && stageContainer != null) {
                    var x = void 0, y = void 0, safeX = void 0, safeY = void 0;
                    if (window.innerWidth >= window.innerHeight) {
                        x = 1280;
                        y = 720;
                        safeX = 960;
                        safeY = 720;
                    }
                    else {
                        x = 720;
                        y = 1280;
                        safeX = 720;
                        safeY = 1215;
                    }
                    var sx = window.innerWidth / x;
                    var sy = window.innerHeight / y;
                    var scale = Math.max(sx, sy);
                    var anchorX = .5;
                    var anchorY = .5;
                    if ((window.innerWidth < (safeX * scale)) || (window.innerHeight < (safeY * scale))) {
                        sx = window.innerWidth / safeX;
                        sy = window.innerHeight / safeY;
                        scale = Math.min(sx, sy);
                    }
                    stageContainer.scale.set(scale);
                    stageContainer.pivot.set(x * anchorX, y * anchorY);
                    stageContainer.position.set(window.innerWidth * anchorX, window.innerHeight * anchorY);
                    this._renderer.render(stageContainer);
                }
            };
            DisplayManager.prototype.offsetPosition = function (type) {
                var point;
                switch (type) {
                    case PositionType.PositionXForLandscape:
                        point = (this.game.stage.container.position.x / this.game.stage.container.scale.x) - 480;
                        break;
                    case PositionType.PositionYForPortrait:
                        point = ((this.game.display.height - this.game.stage.container.position.y) / (this.game.stage.container.scale.y));
                        break;
                }
                return point;
            };
            Object.defineProperty(DisplayManager.prototype, "width", {
                get: function () {
                    return this._renderer.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayManager.prototype, "height", {
                get: function () {
                    return this._renderer.height;
                },
                enumerable: true,
                configurable: true
            });
            DisplayManager.prototype.addRenderTarget = function (rDisplay, rTexture) {
                this._renderTargets.push({ rDisplay: rDisplay, rTexture: rTexture });
            };
            DisplayManager.prototype.removeRenderTarget = function (rDisplay, rTexture) {
                for (var rIndex = 0; rIndex < this._renderTargets.length; rIndex++) {
                    if (rDisplay == this._renderTargets[rIndex].rDisplay &&
                        rTexture == this._renderTargets[rIndex].rTexture) {
                        this._renderTargets[rIndex].rDisplay.destroy();
                        this._renderTargets[rIndex].rTexture.destroy();
                        this._renderTargets[rIndex].rDisplay = null;
                        this._renderTargets[rIndex].rTexture = null;
                        this._renderTargets.splice(rIndex, 1);
                    }
                }
            };
            DisplayManager.prototype.removeAllRenderTargets = function () {
                for (var rIndex = 0; rIndex < this._renderTargets.length; rIndex++) {
                    this._renderTargets[rIndex].rDisplay.destroy();
                    this._renderTargets[rIndex].rTexture.destroy();
                    this._renderTargets[rIndex].rDisplay = null;
                    this._renderTargets[rIndex].rTexture = null;
                }
                this._renderTargets = [];
            };
            DisplayManager.prototype.toggleFullscreen = function () {
                switch (this.isFullscreen) {
                    case true:
                        if (document["exitFullscreen"])
                            document["exitFullscreen"]();
                        else if (document["msExitFullscreen"])
                            document["msExitFullscreen"]();
                        else if (document["mozCancelFullScreen"])
                            document["mozCancelFullScreen"]();
                        else if (document["webkitExitFullscreen"])
                            document["webkitExitFullscreen"]();
                        break;
                    case false:
                        if (this._fullscreenTarget["requestFullscreen"])
                            this._fullscreenTarget["requestFullscreen"]();
                        else if (this._fullscreenTarget["msRequestFullscreen"])
                            this._fullscreenTarget["msRequestFullscreen"]();
                        else if (this._fullscreenTarget["mozRequestFullScreen"])
                            this._fullscreenTarget["mozRequestFullScreen"]();
                        else if (this._fullscreenTarget["webkitRequestFullScreen"])
                            this._fullscreenTarget["webkitRequestFullScreen"]();
                        break;
                }
            };
            DisplayManager.prototype.initProperties = function (container, target) {
                window.addEventListener("resize", this.onWindowResize.bind(this), false);
                window.addEventListener("orientationchange", this.onOrientationChange.bind(this), false);
                document.addEventListener("fullscreenchange", this.onFullscreenChange.bind(this), false);
                document.addEventListener("msfullscreenchange", this.onFullscreenChange.bind(this), false);
                document.addEventListener("mozfullscreenchange", this.onFullscreenChange.bind(this), false);
                document.addEventListener("webkitfullscreenchange", this.onFullscreenChange.bind(this), false);
                document.addEventListener("keydown", this.onFullscreenKeyDown.bind(this), false);
                switch (typeof container) {
                    case "string":
                        switch (container) {
                            case "body":
                                this._rendererContainer = document.body;
                                break;
                            default:
                                this._rendererContainer = (document.getElementById(container)) ?
                                    document.getElementById(container) : document.body;
                                break;
                        }
                        break;
                    default:
                        this._rendererContainer = document.body;
                        break;
                }
                switch (typeof target) {
                    case "string":
                        switch (target) {
                            case "body":
                                this._fullscreenTarget = document.body;
                                break;
                            default:
                                this._fullscreenTarget = (document.getElementById(target)) ?
                                    document.getElementById(target) : this._rendererContainer;
                                break;
                        }
                        break;
                    default:
                        this._fullscreenTarget = this._rendererContainer;
                        break;
                }
                this._renderer.view.id = "videoslot-canvas";
                this._renderer.view.style.width = "100%";
                this._renderer.view.style.height = "100%";
                this._rendererContainer.appendChild(this._renderer.view);
                this.onWindowResize();
            };
            DisplayManager.prototype.onWindowResize = function () {
                var _this = this;
                this._renderer.resize(window.innerWidth, window.innerHeight);
                this._renderer.view.style.width = "100%";
                this._renderer.view.style.height = "100%";
                this.checkOrientation();
                clearTimeout(this.to);
                this.to = setTimeout(function () {
                    _this.checkOrientation();
                    _this.emit("resize", _this.orientation);
                }, 50);
            };
            DisplayManager.prototype.checkOrientation = function () {
                window.innerWidth > window.innerHeight ? this.orientation = "landscape" : this.orientation = "portrait";
            };
            Object.defineProperty(DisplayManager.prototype, "orientation", {
                get: function () {
                    return this._orientation;
                },
                set: function (v) {
                    if (v != this._orientation) {
                        this._orientation = v;
                        this.emit("orientationchange", this._orientation);
                    }
                },
                enumerable: true,
                configurable: true
            });
            DisplayManager.prototype.onOrientationChange = function (event) {
                this.checkOrientation();
            };
            DisplayManager.prototype.onFullscreenChange = function (event) {
                this.emit("fullscreenchange", this.isFullscreen);
            };
            DisplayManager.prototype.onFullscreenKeyDown = function (event) {
                switch (event.keyCode) {
                    case 122:
                        this.toggleFullscreen();
                        event.preventDefault();
                        break;
                    default:
                        break;
                }
            };
            Object.defineProperty(DisplayManager.prototype, "isFullscreen", {
                get: function () {
                    return ((document["mozFullScreenElement"] && document["mozFullScreenElement"] === this._fullscreenTarget) ||
                        (document["webkitFullscreenElement"] && document["webkitFullscreenElement"] === this._fullscreenTarget) ||
                        (document["msFullscreenElement"] && document["msFullscreenElement"] === this._fullscreenTarget) ||
                        (document["fullscreenElement"] && document["fullscreenElement"] === this._fullscreenTarget)) ? true : false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayManager.prototype, "renderer", {
                get: function () {
                    return this._renderer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayManager.prototype, "rendererContainer", {
                get: function () {
                    return this._rendererContainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayManager.prototype, "rendererStyle", {
                get: function () {
                    return this._renderer.view.style;
                },
                enumerable: true,
                configurable: true
            });
            return DisplayManager;
        }(PIXI.utils.EventEmitter));
        Managers.DisplayManager = DisplayManager;
    })(Managers = Core.Managers || (Core.Managers = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Managers;
    (function (Managers) {
        var ResourceManager = (function (_super) {
            __extends(ResourceManager, _super);
            function ResourceManager(baseUrl) {
                if (baseUrl === void 0) { baseUrl = ""; }
                var _this = _super.call(this) || this;
                _this._textures = { default: new PIXI.loaders.Loader() };
                _this._sounds = { default: new Core.Loaders.SoundLoader() };
                _this._loadingQueue = { default: [] };
                _this._loadingCount = { default: 0 };
                _this._loadingProgress = { default: 0 };
                _this._isLoading = { default: false };
                _this.baseUrl = "";
                _this.baseUrl = baseUrl;
                _this._textures[ResourceManager.DEFAULT].baseUrl = baseUrl;
                _this._textures[ResourceManager.DEFAULT].on("progress", _this.onTextureLoadProgress.bind(_this, ResourceManager.DEFAULT), _this);
                _this._textures[ResourceManager.DEFAULT].on("error", _this.onTextureLoadError.bind(_this, ResourceManager.DEFAULT), _this);
                _this._sounds[ResourceManager.DEFAULT].on("progress", _this.onSoundLoadProgress.bind(_this, ResourceManager.DEFAULT), _this);
                _this._sounds[ResourceManager.DEFAULT].on("error", _this.onSoundLoadError.bind(_this, ResourceManager.DEFAULT), _this);
                return _this;
            }
            ResourceManager.prototype.fromResource = function (key, pack) {
                if (pack === void 0) { pack = ResourceManager.DEFAULT; }
                return this._textures[pack].resources[key];
            };
            ResourceManager.prototype.fromFrame = function (key) {
                return PIXI.Texture.fromFrame(key);
            };
            ResourceManager.prototype.addTexture = function (key, url) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                this.addTextureAt.apply(this, [ResourceManager.DEFAULT, key, url].concat(args));
            };
            ResourceManager.prototype.addTextureAt = function (pack, key, url) {
                var args = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    args[_i - 3] = arguments[_i];
                }
                if (!this._loadingQueue.hasOwnProperty(pack)) {
                    this._loadingQueue[pack] = [];
                }
                if (!this._textures.hasOwnProperty(pack)) {
                    console.log("creating texture loader", pack);
                    this._textures[pack] = new PIXI.loaders.Loader();
                    this._textures[pack].baseUrl = this.baseUrl;
                    this._textures[pack].on("progress", this.onTextureLoadProgress.bind(this, pack), this);
                    this._textures[pack].on("error", this.onTextureLoadError.bind(this, pack), this);
                }
                if (!this._loadingCount.hasOwnProperty(pack))
                    this._loadingCount[pack] = 0;
                if (!this._loadingProgress.hasOwnProperty(pack))
                    this._loadingProgress[pack] = 0;
                if (!this._isLoading.hasOwnProperty(pack))
                    this._isLoading[pack] = false;
                this._loadingQueue[pack].push(key);
                (_a = this._textures[pack]).add.apply(_a, [key, url].concat(args));
                var _a;
            };
            ResourceManager.prototype.addTexturePack = function (name) {
                return this.addTextureAt.bind(this, name);
            };
            ResourceManager.prototype.addSound = function (key, channel, src) {
                this.addSoundAt(ResourceManager.DEFAULT, key, channel, src);
            };
            ResourceManager.prototype.addSoundAt = function (pack, key, channel, src) {
                if (!this._loadingQueue.hasOwnProperty(pack)) {
                    this._loadingQueue[pack] = [];
                }
                if (!this._sounds.hasOwnProperty(pack)) {
                    console.log("creating sound loader", pack);
                    this._sounds[pack] = new Core.Loaders.SoundLoader();
                    this._sounds[pack].on("progress", this.onSoundLoadProgress.bind(this, pack), this);
                    this._sounds[pack].on("error", this.onSoundLoadError.bind(this, pack), this);
                }
                if (!this._loadingCount.hasOwnProperty(pack))
                    this._loadingCount[pack] = 0;
                if (!this._loadingProgress.hasOwnProperty(pack))
                    this._loadingProgress[pack] = 0;
                if (!this._isLoading.hasOwnProperty(pack))
                    this._isLoading[pack] = false;
                this._loadingQueue[pack].push(key);
                this._sounds[pack].add(key, channel, src);
            };
            ResourceManager.prototype.addSoundPack = function (name) {
                return this.addSoundAt.bind(this, name);
            };
            ResourceManager.prototype.load = function (pack) {
                if (pack === void 0) { pack = ResourceManager.DEFAULT; }
                this._isLoading[pack] = true;
                this.emit("loadstart", this, pack);
                this._textures.hasOwnProperty(pack) && this._textures[pack].load();
                this._sounds.hasOwnProperty(pack) && this._sounds[pack].load();
            };
            ResourceManager.prototype.reset = function (hardReset, clearEvents, pack) {
                if (hardReset === void 0) { hardReset = false; }
                if (clearEvents === void 0) { clearEvents = false; }
                if (clearEvents == true)
                    this.clearEvents();
                if (hardReset == true) {
                    if (pack === undefined || pack == null) {
                        this._textures[ResourceManager.DEFAULT].reset();
                        this._sounds[ResourceManager.DEFAULT].reset();
                    }
                    else {
                        this._textures.hasOwnProperty(pack) && this._textures[pack].reset();
                        this._sounds.hasOwnProperty(pack) && this._sounds[pack].reset();
                    }
                }
                this.clearProgress();
            };
            ResourceManager.prototype.clearEvents = function () {
                this.off("loadstart");
                this.off("loadprogress");
                this.off("loadcomplete");
                this.off("loaderror");
            };
            ResourceManager.prototype.clearProgress = function (pack) {
                if (pack === void 0) { pack = ResourceManager.DEFAULT; }
                this._loadingCount[pack] = 0;
                this._loadingProgress[pack] = 0;
                this._isLoading[pack] = false;
                this._loadingQueue[pack] = [];
            };
            ResourceManager.prototype.validateLoadQueue = function (key, pack) {
                if (this._loadingQueue[pack].indexOf(key) != -1) {
                    this._loadingCount[pack] += 1;
                    this._loadingProgress[pack] = Math.floor((100 / Object.keys(this._loadingQueue[pack]).length) * this._loadingCount[pack]);
                    this.emit("loadprogress", this._loadingProgress, key, pack);
                    if (this._loadingCount[pack] == Object.keys(this._loadingQueue[pack]).length) {
                        this._isLoading[pack] = false;
                        this._loadingQueue[pack] = [];
                        this.emit("loadcomplete", this, pack);
                    }
                }
            };
            ResourceManager.prototype.onTextureLoadProgress = function (pack, loader, resource) {
                this.validateLoadQueue(resource.name, pack);
            };
            ResourceManager.prototype.onTextureLoadError = function (pack) {
                this.emit("loaderror", "Texture", pack);
            };
            ResourceManager.prototype.onSoundLoadProgress = function (pack, loader, sound, name) {
                this.validateLoadQueue(name, pack);
            };
            ResourceManager.prototype.onSoundLoadError = function (pack) {
                this.emit("loaderror", "Sound", pack);
            };
            Object.defineProperty(ResourceManager.prototype, "loadingCount", {
                get: function () {
                    return this._loadingCount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "loadingProgress", {
                get: function () {
                    return this._loadingProgress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceManager.prototype, "isLoading", {
                get: function () {
                    return this._isLoading;
                },
                enumerable: true,
                configurable: true
            });
            ResourceManager.DEFAULT = "default";
            return ResourceManager;
        }(PIXI.utils.EventEmitter));
        Managers.ResourceManager = ResourceManager;
    })(Managers = Core.Managers || (Core.Managers = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Managers;
    (function (Managers) {
        ;
        Managers.DEFAULT_COMPRESSOR = {
            threshold: -50,
            knee: 40,
            ratio: 12,
            reduction: -20,
            attack: 0,
            release: 0.25
        };
        var SoundManager = (function (_super) {
            __extends(SoundManager, _super);
            function SoundManager(loader) {
                var _this = _super.call(this) || this;
                _this._compressor = null;
                _this._isMuted = Howler["_muted"];
                _this._sounds = loader;
                _this._sounds.on("soundcreate", _this.onSoundCreate, _this);
                _this.connect(Managers.DEFAULT_COMPRESSOR);
                _this.initWindowFocusHandler();
                return _this;
            }
            SoundManager.prototype.play = function (key, volume, loop) {
                if (volume === void 0) { volume = 1; }
                if (loop === void 0) { loop = false; }
                if (key in this._sounds.resources) {
                    this._sounds.resources[key].sound.volume(volume);
                    this._sounds.resources[key].sound.loop(loop);
                    this._sounds.resources[key].sound.play();
                }
            };
            SoundManager.prototype.pause = function (key) {
                if (key in this._sounds.resources)
                    this._sounds.resources[key].sound.pause();
            };
            SoundManager.prototype.stop = function (key) {
                if (key in this._sounds.resources)
                    this._sounds.resources[key].sound.stop();
            };
            SoundManager.prototype.seek = function (key, seconds) {
                if (key in this._sounds.resources) {
                    switch (typeof seconds) {
                        case "number":
                            var whatTheHellYouAreDoingHere = "seek";
                            this._sounds.resources[key].sound.seek(seconds);
                            break;
                        default:
                            this._sounds.resources[key].sound.seek();
                            break;
                    }
                }
            };
            SoundManager.prototype.fade = function (key, from, to, duration) {
                if (key in this._sounds.resources)
                    this._sounds.resources[key].sound.fade(from, to, (duration * 1000));
            };
            SoundManager.prototype.loop = function (key, value) {
                if (key in this._sounds.resources)
                    this._sounds.resources[key].sound.loop(value);
            };
            SoundManager.prototype.volume = function (key, value) {
                if (key in this._sounds.resources)
                    this._sounds.resources[key].sound.volume(value);
            };
            SoundManager.prototype.connect = function (compressor) {
                var c = Howler["ctx"];
                var m = Howler["masterGain"];
                if ((typeof c === "undefined" || c == null) ||
                    (typeof m === "undefined" || m == null))
                    return;
                if (this._compressor != null)
                    m.disconnect(this._compressor);
                this._compressor = c.createDynamicsCompressor();
                this._compressor.threshold.value = compressor.threshold;
                this._compressor.knee.value = compressor.knee;
                this._compressor.ratio.value = compressor.ratio;
                this._compressor.reduction.value = compressor.reduction;
                this._compressor.attack.value = compressor.attack;
                this._compressor.release.value = compressor.release;
                this._compressor.connect(c.destination);
                m.connect(this._compressor);
            };
            SoundManager.prototype.disconnect = function () {
                var m = Howler["masterGain"];
                if (typeof m === "undefined" || m == null)
                    return;
                if (this._compressor != null)
                    m.disconnect(this._compressor);
                this._compressor = null;
            };
            SoundManager.prototype.muteSound = function (key) {
                if (key in this._sounds.resources) {
                    if (this._sounds.resources[key].isChannelMuted == false) {
                        this._sounds.resources[key].isSoundMuted = true;
                        this._sounds.resources[key].sound.mute(true);
                    }
                    else if (this._sounds.resources[key].isChannelMuted == true)
                        this._sounds.resources[key].isSoundMuted = true;
                }
            };
            SoundManager.prototype.unmuteSound = function (key) {
                if (key in this._sounds.resources) {
                    if (this._sounds.resources[key].isChannelMuted == false) {
                        this._sounds.resources[key].isSoundMuted = false;
                        this._sounds.resources[key].sound.mute(false);
                    }
                    else if (this._sounds.resources[key].isChannelMuted == true)
                        this._sounds.resources[key].isSoundMuted = false;
                }
            };
            SoundManager.prototype.muteChannel = function (key) {
                for (var sound in this._sounds.resources) {
                    if (this._sounds.resources[sound].channel == key) {
                        this._sounds.resources[sound].isChannelMuted = true;
                        this._sounds.resources[sound].sound.mute(true);
                    }
                }
            };
            SoundManager.prototype.unmuteChannel = function (key) {
                for (var sound in this._sounds.resources) {
                    if (this._sounds.resources[sound].channel == key) {
                        this._sounds.resources[sound].isChannelMuted = false;
                        this._sounds.resources[sound].sound.mute(this._sounds.resources[sound].isSoundMuted);
                    }
                }
            };
            SoundManager.prototype.isSoundMuted = function (key) {
                if (key in this._sounds.resources)
                    return this._sounds.resources[key].isSoundMuted;
            };
            SoundManager.prototype.isChannelMuted = function (key) {
                for (var sound in this._sounds.resources) {
                    if (this._sounds.resources[sound].channel == key)
                        return this._sounds.resources[sound].isChannelMuted;
                }
            };
            SoundManager.prototype.isPlaying = function (key) {
                if (key in this._sounds.resources)
                    return this._sounds.resources[key].sound.playing();
            };
            SoundManager.prototype.isLooping = function (key) {
                if (key in this._sounds.resources)
                    return this._sounds.resources[key].sound.loop();
            };
            SoundManager.prototype.onSoundPlay = function (sound, key) {
                this.emit("play", sound, key);
            };
            SoundManager.prototype.onSoundEnd = function (sound, key) {
                this.emit("end", sound, key);
            };
            SoundManager.prototype.onSoundPause = function (sound, key) {
                this.emit("pause", sound, key);
            };
            SoundManager.prototype.onSoundStop = function (sound, key) {
                this.emit("stop", sound, key);
            };
            SoundManager.prototype.onSoundMute = function (sound, key) {
                this.emit("mute", sound, key);
            };
            SoundManager.prototype.onSoundCreate = function (sound, key) {
                sound.on("play", this.onSoundPlay.bind(this, sound, key));
                sound.on("end", this.onSoundEnd.bind(this, sound, key));
                sound.on("pause", this.onSoundPause.bind(this, sound, key));
                sound.on("stop", this.onSoundStop.bind(this, sound, key));
                sound.on("mute", this.onSoundMute.bind(this, sound, key));
            };
            SoundManager.prototype.initWindowFocusHandler = function () {
                var _this = this;
                var hidden = "hidden";
                var onchange = function (evt) {
                    var v = "visible", h = "hidden", evtMap = {
                        focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
                    };
                    evt = evt || window.event;
                    try {
                        if (_this.isGlobalMuted == false)
                            Howler.mute(document[hidden]);
                    }
                    catch (e) { }
                };
                if (hidden in document)
                    document.addEventListener("visibilitychange", onchange);
                else if ((hidden = "mozHidden") in document)
                    document.addEventListener("mozvisibilitychange", onchange);
                else if ((hidden = "webkitHidden") in document)
                    document.addEventListener("webkitvisibilitychange", onchange);
                else if ((hidden = "msHidden") in document)
                    document.addEventListener("msvisibilitychange", onchange);
                else if ("onfocusin" in document)
                    document["onfocusin"] = document["onfocusout"] = onchange;
                else
                    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
                if (document[hidden] !== undefined)
                    onchange({ type: document[hidden] ? "blur" : "focus" });
            };
            Object.defineProperty(SoundManager.prototype, "globalVolume", {
                get: function () {
                    return Howler.volume();
                },
                set: function (value) {
                    Howler.volume(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SoundManager.prototype, "isGlobalMuted", {
                get: function () {
                    return this._isMuted;
                },
                set: function (value) {
                    if (this._isMuted != value) {
                        this._isMuted = value;
                        Howler.mute(this._isMuted);
                        this.emit("globalmute", this._isMuted);
                    }
                },
                enumerable: true,
                configurable: true
            });
            return SoundManager;
        }(PIXI.utils.EventEmitter));
        Managers.SoundManager = SoundManager;
    })(Managers = Core.Managers || (Core.Managers = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Managers;
    (function (Managers) {
        var StageManager = (function () {
            function StageManager(game) {
                this._container = new Core.Parts.Container(null, "StageContainer");
                this._instances = {};
                this.game = game;
            }
            StageManager.prototype.start = function (name, stageBase, resetStages, resetLoader, properties) {
                if (resetStages === void 0) { resetStages = true; }
                if (resetLoader === void 0) { resetLoader = false; }
                if (properties === void 0) { properties = {}; }
                var args = [];
                for (var _i = 5; _i < arguments.length; _i++) {
                    args[_i - 5] = arguments[_i];
                }
                if (resetLoader == true)
                    this.game.resource.reset(true, true);
                if (resetStages == true)
                    this.removeAll();
                this.game.display.removeAllRenderTargets();
                return this.createStage.apply(this, [name, stageBase, properties].concat(args));
            };
            StageManager.prototype.remove = function (name) {
                if (typeof this._instances[name].dispose === "function")
                    this._instances[name].dispose.call(this._instances[name]);
                this._instances[name].destroy({ children: true, baseTexture: true });
                delete this._instances[name];
            };
            StageManager.prototype.removeAll = function () {
                for (var key in this._instances) {
                    if (typeof this._instances[key].dispose === "function")
                        this._instances[key].dispose.call(this._instances[key]);
                    this._instances[key].destroy({ children: true, baseTexture: true });
                }
                delete this._instances;
                this._instances = {};
            };
            StageManager.prototype.update = function (elapsedMS, deltaTime) {
                for (var key in this._instances) {
                    if (typeof this._instances[key].update === "function")
                        this._instances[key].update.call(this._instances[key], elapsedMS, deltaTime);
                }
            };
            StageManager.prototype.createStage = function (name, stageBase, properties) {
                if (properties === void 0) { properties = {}; }
                var args = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    args[_i - 3] = arguments[_i];
                }
                this._instances[name] = new stageBase(this.game, name);
                for (var property in properties)
                    if (property in this._instances[name])
                        this._instances[name][property] = properties[property];
                if (typeof this._instances[name].init === "function")
                    (_a = this._instances[name].init).call.apply(_a, [this._instances[name]].concat(args));
                return this._container.addChild(this._instances[name]);
                var _a;
            };
            Object.defineProperty(StageManager.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            return StageManager;
        }());
        Managers.StageManager = StageManager;
    })(Managers = Core.Managers || (Core.Managers = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var ListenerType;
    (function (ListenerType) {
        ListenerType["animationcomplete"] = "animationcomplete";
        ListenerType["init"] = "init";
        ListenerType["error"] = "error";
        ListenerType["response"] = "response";
        ListenerType["close"] = "close";
        ListenerType["orientationchange"] = "orientationchange";
        ListenerType["resize"] = "resize";
        ListenerType["fullscreenchange"] = "fullscreenchange";
    })(ListenerType = Core.ListenerType || (Core.ListenerType = {}));
    var DisplayResolution;
    (function (DisplayResolution) {
        DisplayResolution[DisplayResolution["width"] = 1280] = "width";
        DisplayResolution[DisplayResolution["height"] = 720] = "height";
    })(DisplayResolution = Core.DisplayResolution || (Core.DisplayResolution = {}));
    var SendAction;
    (function (SendAction) {
        SendAction["globeSelect"] = "globeSelect";
        SendAction["newCard"] = "newCard";
    })(SendAction = Core.SendAction || (Core.SendAction = {}));
    var ButtonStateType;
    (function (ButtonStateType) {
        ButtonStateType[ButtonStateType["sendAction"] = 0] = "sendAction";
        ButtonStateType[ButtonStateType["response"] = 1] = "response";
        ButtonStateType[ButtonStateType["forward"] = 2] = "forward";
        ButtonStateType[ButtonStateType["instant"] = 3] = "instant";
        ButtonStateType[ButtonStateType["updateData"] = 4] = "updateData";
        ButtonStateType[ButtonStateType["turboDisabled"] = 5] = "turboDisabled";
    })(ButtonStateType = Core.ButtonStateType || (Core.ButtonStateType = {}));
    var VisualType;
    (function (VisualType) {
        VisualType[VisualType["turbo"] = 0] = "turbo";
        VisualType[VisualType["normal"] = 1] = "normal";
        VisualType[VisualType["forward"] = 2] = "forward";
        VisualType[VisualType["instant"] = 3] = "instant";
        VisualType[VisualType["connectionLost"] = 4] = "connectionLost";
    })(VisualType = Core.VisualType || (Core.VisualType = {}));
    var BingoType;
    (function (BingoType) {
        BingoType["turbo"] = "turbo";
        BingoType["normal"] = "normal";
        BingoType["instant"] = "instant";
        BingoType["connectionLost"] = "connectionLost";
        BingoType["stoppedAnimation"] = "stoppedAnimation";
    })(BingoType = Core.BingoType || (Core.BingoType = {}));
    var DisplayOrientation;
    (function (DisplayOrientation) {
        DisplayOrientation["landscape"] = "landscape";
        DisplayOrientation["portrait"] = "portrait";
    })(DisplayOrientation = Core.DisplayOrientation || (Core.DisplayOrientation = {}));
    var WinType;
    (function (WinType) {
        WinType["bigwin"] = "bigWin";
        WinType["normal"] = "normal";
    })(WinType = Core.WinType || (Core.WinType = {}));
    var Anchor;
    (function (Anchor) {
        Anchor["left"] = "left";
        Anchor["center"] = "center";
        Anchor["right"] = "right";
    })(Anchor = Core.Anchor || (Core.Anchor = {}));
    var LanguageNames;
    (function (LanguageNames) {
        LanguageNames["MatrixHeader"] = "BingoMatrixHeader";
        LanguageNames["BallValue"] = "BallValue";
        LanguageNames["MatrixHeaderValue"] = "BingoMatrixHeaderValue";
        LanguageNames["MatrixNumberValue"] = "BingoMatrixNumberValue";
        LanguageNames["NewCard"] = "NewCardText";
        LanguageNames["CardNumberValue"] = "CardNumberViewValueEmpty";
        LanguageNames["PayoutSelectorBallsCounterValue"] = "PayoutSelectorViewBallsCounterValue";
        LanguageNames["PayoutSelectorValue"] = "PayoutSelectorViewValue";
        LanguageNames["TurboButton"] = "TurboButtonText";
        LanguageNames["BetValue"] = "BetValueText";
        LanguageNames["MachineHeadValue"] = "MachineHeadValue";
        LanguageNames["BigWinHeader"] = "BigWinHeaderText";
        LanguageNames["BigWinValue"] = "BigWinValue";
        LanguageNames["Win"] = "WinText";
        LanguageNames["WinValue"] = "WinValue";
        LanguageNames["ModeText"] = "ModeText";
        LanguageNames["Balance"] = "CreditText";
        LanguageNames["BalanceValue"] = "CreditValue";
        LanguageNames["InstantButton"] = "InstantButtonText";
        LanguageNames["ErrorParse"] = "Error_Parse";
        LanguageNames["ErrorGeneralHeader"] = "Error_General_Header";
        LanguageNames["ErrorSessionTimeoutHeader"] = "Error_Session_Time_Out_Header";
        LanguageNames["ErrorSessionTimeOut"] = "Error_Session_Time_Out";
        LanguageNames["ErrorConnectionHeader"] = "Error_WebSocketConnection_Header";
        LanguageNames["ErrorConnection"] = "Error_WebSocketConnection";
        LanguageNames["ErrorInsufficientfundsHeader"] = "Error_Insufficient_funds_header";
        LanguageNames["ErrorInsufficientfundsBalance"] = "Error_Insufficient_funds_notenoughBalanceText";
        LanguageNames["ErrorInsufficientfundsCurrentBet"] = "Error_Insufficient_funds_currentBetLevel";
        LanguageNames["ErrorInsufficientfundsMinBet"] = "Error_Insufficient_funds_minimumBetLevel";
        LanguageNames["ErrorMaxBetHeader"] = "Error_MaxBet_Header";
        LanguageNames["ErrorMaxBetnotenoughBalance"] = "Error_MaxBet_notenoughBalance";
        LanguageNames["ErrorMaxBetBalance"] = "Error_MaxBet_enoughBalanceText";
        LanguageNames["ErrorReconnectRestoreSessionHeader"] = "Error_Reconnect_Restore_Session_Header";
        LanguageNames["ErrorReconnectRestoreSession"] = "Error_Reconnect_Restore_Session";
        LanguageNames["ErrorMessageHeader"] = "ErrorMessageHeaderText";
        LanguageNames["ErrorMessage"] = "ErrorMessageText";
        LanguageNames["GeneralButton"] = "GeneralButtonText";
        LanguageNames["ReloadButton"] = "ReloadButton";
        LanguageNames["ContinueButton"] = "ContinueButton";
        LanguageNames["OkButton"] = "OkButton";
        LanguageNames["WinPopupHeader"] = "WinPopupHeaderText";
        LanguageNames["WinPopupWon"] = "WinPopup_WonText";
    })(LanguageNames = Core.LanguageNames || (Core.LanguageNames = {}));
    var StyleInformation = (function () {
        function StyleInformation() {
        }
        StyleInformation.UI = {
            Home: { out: "UI/home_normal", over: "UI/home_over", down: "UI/home_down", disabled: "UI/home_down" },
            History: { out: "UI/history_normal", over: "UI/history_over", down: "UI/history_down", disabled: "UI/history_disabled" },
            Help: { out: "UI/help_normal", over: "UI/help_over", down: "UI/help_down", disabled: "UI/help_disabled" },
            Menu: { out: "UI/menu_normal", over: "UI/menu_over", down: "UI/menu_down", disabled: "UI/menu_disabled" },
            SoundOff: { out: "UI/soundoff_normal", over: "UI/soundoff_over", down: "UI/soundoff_down", disabled: "UI/soundoff_disabled" },
            SoundOn: { out: "UI/soundon_normal", over: "UI/soundon_over", down: "UI/soundon_down", disabled: "UI/soundon_disabled" },
            Minimize: { out: "UI/minimize_normal", over: "UI/minimize_over", down: "UI/minimize_down", disabled: "UI/minimize_disabled" },
            FullScreen: { out: "UI/fullscreen_normal", over: "UI/fullscreen_over", down: "UI/fullscreen_down", disabled: "UI/fullscreen_disabled" },
            ForwardButton: { out: "Forward/forward_out", over: "Forward/forward_over", down: "Forward/forward_down", disabled: "Forward/forward_disabled" },
            GeneralButton: { out: "UI/button_out", over: "UI/button_over", down: "UI/button_down", disabled: "UI/button_disabled" },
            NewCardButton: { out: "Card/new_card_out", over: "Card/new_card_over", down: "Card/new_card_down", disabled: "Card/new_card_disable" },
            TurboButtonOn: { out: "Turbo/turbo_landscape_on", over: "Turbo/turbo_landscape_on", down: "Turbo/turbo_landscape_on", disabled: "Turbo/turbo_landscape_on" },
            TurboButtonOut: { out: "Turbo/turbo_landscape_out", over: "Turbo/turbo_landscape_over", down: "Turbo/turbo_landscape_down", disabled: "Turbo/turbo_landscape_disabled" },
            BetDownButton: { out: "Bet/betdownbutton_out", over: "Bet/betdownbutton_over", down: "Bet/betdownbutton_down", disabled: "Bet/betdownbutton_disabled" },
            BetPlusButton: { out: "Bet/betplusbutton_out", over: "Bet/betplusbutton_over", down: "Bet/betplusbutton_down", disabled: "Bet/betplusbutton_disabled" },
            PlayButton: { out: "Play/play_landscape_button_out", over: "Play/play_landscape_button_over", down: "Play/play_landscape_button_down", disabled: "Play/play_landscape_button_disabled" },
        };
        StyleInformation.GeneralButton = {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "22px",
            fontWeight: "bold",
            fill: "#d08f38",
            stroke: 0x000000,
            strokeThickness: 3
        };
        StyleInformation.ErrorMessageHeader = {
            align: "center",
            fontFamily: "agencyfb",
            strokeThickness: 3,
            fill: "#d08f38",
            stroke: 0x000000,
            fontSize: "40px",
            fontWeight: "bold"
        };
        StyleInformation.ErrorMessageText = {
            fontFamily: "Montserrat, sans-serif",
            fill: "#8bf2ae",
            stroke: 0x000000,
            strokeThickness: 3,
            fontSize: "24px",
            fontWeight: "600",
            wordWrap: true,
            wordWrapWidth: 400,
            align: "center"
        };
        StyleInformation.Win = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        };
        StyleInformation.BalanceValue = {
            align: "center",
            fill: "0xffffff",
            fontFamily: "agencyfb",
            fontSize: "24px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 1
        };
        StyleInformation.Balance = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        };
        StyleInformation.Mode = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        };
        StyleInformation.WinValue = {
            align: "center",
            fill: "0xffffff",
            fontFamily: "agencyfb",
            fontSize: "24px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 1
        };
        StyleInformation.MatrixHeaderValue = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "20px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        };
        StyleInformation.BigWinHeader = {
            align: "center",
            fontFamily: "agencyfb",
            fill: [
                "0xff9f1f",
                "0xffff24"
            ],
            fontSize: "100px",
            fontWeight: "bold",
            stroke: "0x472312",
            strokeThickness: 7
        };
        StyleInformation.BigWinValue = {
            align: "center",
            fontFamily: "agencyfb",
            fill: [
                "0xff9f1f",
                "0xffff24"
            ],
            fontSize: "70px",
            fontWeight: "bold",
            stroke: "0x472312",
            strokeThickness: 7
        };
        StyleInformation.MachineHeadValue = {
            align: "center",
            fill: "0xfac858",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0xbb440c",
            strokeThickness: 3,
            dropShadow: true,
            dropShadowAlpha: 1,
            dropShadowAngle: 1,
            dropShadowBlur: 1,
            dropShadowColor: 1,
            dropShadowDistance: 1
        };
        StyleInformation.BallValue = {
            align: "center",
            fill: "0x000000",
            fontFamily: "agencyfb",
            fontSize: "50px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 1
        };
        StyleInformation.TurboButtonOut = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "25px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 2
        };
        StyleInformation.TurboButtonOn = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontSize: "25px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 2
        };
        StyleInformation.TurboButtonDisabled = {
            align: "center",
            fill: "#999999",
            fontFamily: "agencyfb",
            fontSize: "25px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 2
        };
        StyleInformation.BetValue = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        };
        StyleInformation.NewCard = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontSize: "20px",
            fontWeight: "bold",
            stroke: "0xb71e01",
            strokeThickness: 1
        };
        StyleInformation.PayoutSelectorBallsEmptyState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        };
        StyleInformation.PayoutSelectorBallsMatchState = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        };
        StyleInformation.PayoutSelectorEmptyState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        };
        StyleInformation.PayoutSelectorMatchState = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        };
        StyleInformation.CardNumberEmptyState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "20px",
            stroke: "0x89efac",
            strokeThickness: 1
        };
        StyleInformation.CardNumberMatchState = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "20px",
            stroke: "0xb71e01",
            strokeThickness: 1
        };
        StyleInformation.MatrixEmptyState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        };
        StyleInformation.MatrixMatchState = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        };
        StyleInformation.MatrixNumberPassState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        };
        StyleInformation.MatrixNumberOnSceenState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        };
        StyleInformation.MatrixHeader = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontSize: "17px",
            fontWeight: "bold",
            stroke: "0xb71e01",
            strokeThickness: 0.3
        };
        StyleInformation.BackgroundFrames = {
            Black: "Background/backgroundblack",
            PortraitNormalBackground: "Background/bg_normal",
            PortraitTurboBackground: "Background/bg_turbo",
            LandscapeNormalBackground: "Background/bg_landscape_normal",
            LandscapeTurboBackground: "Background/bg_landscape_turbo",
            CoverTop: "Background/cover_top",
            CoverBottom: "Background/cover_bottom",
            CoverLeft: "Background/cover_left",
            CoverRight: "Background/cover_right",
            Logo: "Background/logo"
        };
        StyleInformation.CardFrames = {
            CardFrame: "Card/card_landscape_frame",
            CardBackground: "Card/card_landscape_background",
            CardLines: "Card/card_landscape_lines",
            CardMatchBox: "Card/card_landscape_matchbox"
        };
        StyleInformation.MachineFrames = {
            Machine: "Machines/machine",
            NormalBall: "Machines/normal_ball",
            TurboBall: "Machines/turbo_ball",
            NormalLeftArm: "Machines/normal_arm_left",
            NormalRightArm: "Machines/normal_arm_right",
            NormalLeftEyes: "Machines/normal_eyes_left",
            NormalRightEyes: "Machines/normal_eyes_right",
            NormalHead: "Machines/normal_head",
            NormalMouth: "Machines/normal_mouth",
            NormalTeeth: "Machines/normal_teeth",
            NormalWheel: "Machines/normal_wheel",
            TurboLeftArm: "Machines/turbo_arm_left",
            TurboRightArm: "Machines/turbo_arm_right",
            TurboLeftEyes: "Machines/turbo_eyes_left",
            TurboRightEyes: "Machines/turbo_eyes_right",
            TurboHead: "Machines/turbo_head",
            TurboMouth: "Machines/turbo_mouth",
            TurboTeeth: "Machines/turbo_teeth",
            TurboWheel: "Machines/turbo_wheel",
            Light: "Machines/light"
        };
        StyleInformation.BackgroundSmokes = {
            SmokeAnim1: "smokeAnim1/",
            SmokeAnim2: "SmokeAnim2/",
            SmokeAnim3: "SmokeAnim3/"
        };
        StyleInformation.BetScreen = "Bet/betscreen";
        StyleInformation.MatrixFrames = {
            Background: "BingoMatrix/bm_landscape_background",
            FrameNormal: "BingoMatrix/bm_landscape_frame_normal",
            FrameTurbo: "BingoMatrix/bm_landscape_frame_turbo",
            BoxPass: "BingoMatrix/bingoMatrixBoxPass",
            BoxOnScreen: "BingoMatrix/bingoMatrixBoxOnScreen",
            BoxMatch: "BingoMatrix/bingoMatrixBoxMatch"
        };
        StyleInformation.PayoutFrames = {
            Background: "Payout/payout_landscape_background",
            BallsLine: "Payout/payout_landscape_ballsline",
            FrameNormal: "Payout/payout_landscape_frame_normal",
            Indicator: "Payout/payout_landscape_indicator",
            LineMatch: "Payout/payout_line_match"
        };
        StyleInformation.Popup = "UI/win_Popup";
        StyleInformation.DolarBall = "Machines/dolarball";
        StyleInformation.PlayButtonEffect = "playButtonEffect/";
        StyleInformation.TurboButtonEffect = "TurboButtonEffect/";
        StyleInformation.HeadSmokeEffect = "headEffect/";
        StyleInformation.NoseSmokeEffect = "noseEffect/";
        StyleInformation.HeadElectricEffect = "headElectric/";
        StyleInformation.TurboSmokeEffect = "TurboSmoke/";
        StyleInformation.MonitorAnim = "monitor/";
        StyleInformation.BigWinCoins = "BigWin/bigwin_coins";
        return StyleInformation;
    }());
    Core.StyleInformation = StyleInformation;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Modules;
    (function (Modules) {
        var Stage = (function (_super) {
            __extends(Stage, _super);
            function Stage(game, name) {
                if (name === void 0) { name = "Stage"; }
                var _this = _super.call(this, null, name) || this;
                _this.game = game;
                return _this;
            }
            return Stage;
        }(Core.Parts.Container));
        Modules.Stage = Stage;
    })(Modules = Core.Modules || (Core.Modules = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var AnimatedSprite = (function (_super) {
            __extends(AnimatedSprite, _super);
            function AnimatedSprite(x, y, textures, loop, speed, parent, name) {
                if (loop === void 0) { loop = false; }
                if (speed === void 0) { speed = 1; }
                var _this = _super.call(this, textures) || this;
                _this._zIndex = 0;
                _this.anchor.set(0.5, 0.5);
                _this.loop = loop;
                _this.position.set(x, y);
                _this.animationSpeed = speed;
                _this.name = name;
                if (parent)
                    parent.addChild(_this);
                return _this;
            }
            AnimatedSprite.prototype.setAnimation = function (textures, currentFrame) {
                if (currentFrame === void 0) { currentFrame = 0; }
                this.textures = textures;
                if (currentFrame != null)
                    this.texture = textures[currentFrame];
                if (currentFrame != null)
                    this.currentFrame = currentFrame;
            };
            AnimatedSprite.prototype.resetAnimation = function (currentFrame) {
                if (currentFrame === void 0) { currentFrame = 0; }
                if (currentFrame != null)
                    this.gotoAndStop(currentFrame);
                if (currentFrame != null)
                    this.texture = this.textures[currentFrame];
            };
            Object.defineProperty(AnimatedSprite.prototype, "angle", {
                get: function () {
                    return Math.round(1 / ((Math.PI / 180) / this.rotation));
                },
                set: function (value) {
                    this.rotation = ((Math.PI / 180) * value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimatedSprite.prototype, "zIndex", {
                get: function () {
                    return this._zIndex;
                },
                set: function (value) {
                    this._zIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            AnimatedSprite.generateTextures = function (prefix, start, stop, suffix, padding) {
                if (suffix === void 0) { suffix = ""; }
                if (padding === void 0) { padding = 0; }
                try {
                    var frameTextures = [];
                    if (start <= stop) {
                        for (var frameNo = start; frameNo <= stop; frameNo++) {
                            var frameName = prefix;
                            var padDiff = padding - frameNo.toString().length;
                            if (padDiff > 0)
                                for (var index = 0; index < padDiff; index++)
                                    frameName += "0";
                            frameName += frameNo.toString();
                            frameName += suffix;
                            frameTextures.push(PIXI.Texture.fromFrame(frameName));
                        }
                    }
                    else {
                        for (var frameNo = start; frameNo >= stop; frameNo--) {
                            var frameName = prefix;
                            var padDiff = padding - frameNo.toString().length;
                            if (padDiff > 0)
                                for (var index = 0; index < padDiff; index++)
                                    frameName += "0";
                            frameName += frameNo.toString();
                            frameName += suffix;
                            frameTextures.push(PIXI.Texture.fromFrame(frameName));
                        }
                    }
                    return frameTextures;
                }
                catch (e) {
                    throw "Error: " + e.message;
                }
            };
            return AnimatedSprite;
        }(PIXI.extras.AnimatedSprite));
        Parts.AnimatedSprite = AnimatedSprite;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var ButtonStates;
        (function (ButtonStates) {
            ButtonStates["Up"] = "Up";
            ButtonStates["Down"] = "Down";
            ButtonStates["Out"] = "Out";
            ButtonStates["Over"] = "Over";
        })(ButtonStates = Parts.ButtonStates || (Parts.ButtonStates = {}));
        var ButtonEvents;
        (function (ButtonEvents) {
            ButtonEvents["Click"] = "onClick";
            ButtonEvents["Down"] = "onDown";
            ButtonEvents["Up"] = "onUp";
            ButtonEvents["Over"] = "onOver";
            ButtonEvents["Out"] = "onOut";
        })(ButtonEvents = Parts.ButtonEvents || (Parts.ButtonEvents = {}));
        var BasicButton = (function (_super) {
            __extends(BasicButton, _super);
            function BasicButton(x, y, callback, context, frames, parent, name) {
                var _this = _super.call(this, null) || this;
                _this._zIndex = 0;
                _this._callback = null;
                _this._context = null;
                _this._text = null;
                _this._state = ButtonStates.Out;
                _this._frames = null;
                _this._states = { out: 0xFFFFFF, over: 0xFFFFFF, down: 0xFFFFFF, disabled: 0xFFFFFF };
                _this._sounds = { Up: null, Down: null, Over: null, Out: null };
                _this._codes = [];
                _this._isPressed = false;
                _this._isOver = false;
                _this._isEnabled = true;
                _this._maxPoint = 1;
                _this.anchor.set(0.5, 0.5);
                _this.position.set(x, y);
                _this.buttonMode = true;
                _this.interactive = true;
                _this._callback = callback;
                _this.name = name;
                _this._context = context;
                _this.setFrames(frames);
                _this.on("pointerout", _this.onButtonOut, _this);
                _this.on("pointerover", _this.onButtonOver, _this);
                _this.on("pointerdown", _this.onButtonDown, _this);
                _this.on("pointerup", _this.onButtonUp, _this);
                _this.on("pointerupoutside", _this.onButtonUpOutside, _this);
                parent && parent.addChild(_this);
                return _this;
            }
            BasicButton.create = function (x, y, callback, context, texture, parent) {
                var instance = new BasicButton(x, y, callback, context, { out: texture + "_out", over: texture + "_over", down: texture + "_down", disabled: texture + "_disabled" }, parent);
                return instance;
            };
            Object.defineProperty(BasicButton.prototype, "Callback", {
                set: function (callback) {
                    this._callback = callback;
                },
                enumerable: true,
                configurable: true
            });
            BasicButton.prototype.setFrames = function (frames) {
                this._frames = (typeof frames === "object" && frames != null) ? frames : this._frames;
                this.resolveButtonState(this._state);
            };
            BasicButton.prototype.setStates = function (states) {
                this._states = (typeof states === "object" && frames != null) ? states : this._states;
                this.resolveButtonState(this._state);
            };
            BasicButton.prototype.setText = function (text, states) {
                if (typeof text === "undefined" || text == null)
                    return;
                if (typeof this._text === "object" && this._text != null)
                    this.removeChild(this._text);
                this.addChild(this._text = text);
                this.setStates(states);
            };
            BasicButton.prototype.setSoundFx = function (sound, state, volume) {
                if (state === void 0) { state = ButtonStates.Up; }
                if (volume === void 0) { volume = 1.0; }
                this._sounds[state] = { sound: sound, volume: volume };
            };
            BasicButton.prototype.captureKey = function (code) {
                if (typeof this._codes === "undefined" || this._codes == null)
                    this._codes = [];
                if (this._codes.length == 0) {
                    document.addEventListener("keydown", this.onKeyDown.bind(this));
                    document.addEventListener("keyup", this.onKeyUp.bind(this));
                }
                this._codes[this._codes.length] = code;
            };
            BasicButton.prototype.removeKey = function (code) {
                if (typeof this._codes === "undefined" || this._codes == null)
                    this._codes = [];
                if (this._codes.length != 0) {
                    var index = this._codes.indexOf(code);
                    this._codes.splice(((index == -1) ? this._codes.length : index), 1);
                }
            };
            BasicButton.prototype.onKeyDown = function (event) {
                if (this._codes.indexOf(event.keyCode) != -1)
                    this.onButtonDown(null);
            };
            BasicButton.prototype.onKeyUp = function (event) {
                if (this._codes.indexOf(event.keyCode) != -1)
                    this.onButtonUp(null);
            };
            BasicButton.prototype.onButtonOut = function (e) {
                if (e.data != undefined && e.data.originalEvent.touches && e.data.originalEvent.touches.length > 1)
                    return;
                this._state = ButtonStates.Out;
                this.resolveButtonState(this._state);
                if (this._isEnabled == true) {
                    if (this._isPressed == true)
                        this.emit("pointerup", true);
                    this._isPressed = false;
                }
            };
            BasicButton.prototype.onButtonOver = function (e) {
                if (e.data != undefined && e.data.originalEvent.touches && e.data.originalEvent.touches.length > 1)
                    return;
                this._state = ButtonStates.Over;
                if (this._isEnabled == true) {
                    this.resolveButtonState(this._state);
                    Core.Controller.SoundController.instance.playButtonSound();
                }
            };
            BasicButton.prototype.onButtonDown = function (e) {
                if (e.data != undefined && e.data.originalEvent.touches && e.data.originalEvent.touches.length > 1)
                    return;
                if (this._isEnabled == true) {
                    this._state = ButtonStates.Down;
                    this.resolveButtonState(this._state);
                    this._isPressed = true;
                }
            };
            BasicButton.prototype.onButtonUp = function (skipCallback) {
                if (skipCallback != true && this._isEnabled == true && this._isPressed == true) {
                    this._state = ButtonStates.Out;
                    this.resolveButtonState(this._state);
                    if (this._callback)
                        this._callback.call(this._context, this);
                    this._isPressed = false;
                }
            };
            BasicButton.prototype.onButtonUpOutside = function () {
                this._state = ButtonStates.Up;
                this._isPressed = false;
                this._isOver = false;
                this._isEnabled && this.emit(ButtonEvents.Up);
                this.resolveButtonState(this._state);
            };
            BasicButton.prototype.playSound = function (state) {
                if (this._isEnabled && this._sounds[this._state]) {
                    Core.Game.instance.sound.play(this._sounds[this._state].sound, this._sounds[this._state].volume);
                }
            };
            BasicButton.prototype.resolveButtonState = function (buttonState) {
                var currentState = null;
                switch (this.isEnabled) {
                    case true:
                        switch (buttonState) {
                            case ButtonStates.Up:
                                this.texture = PIXI.Texture.fromFrame(this._isOver ? this._frames.over : this._frames.out);
                                currentState = this._states.out;
                                break;
                            case ButtonStates.Down:
                                this.texture = PIXI.Texture.fromFrame(this._frames.down);
                                currentState = this._states.down;
                                break;
                            case ButtonStates.Out:
                                this.texture = PIXI.Texture.fromFrame(this._frames.out);
                                currentState = this._states.out;
                                break;
                            case ButtonStates.Over:
                                this.texture = PIXI.Texture.fromFrame(this._frames.over);
                                currentState = this._states.over;
                                break;
                        }
                        break;
                    case false:
                        this.texture = PIXI.Texture.fromFrame(this._frames.disabled);
                        currentState = this._states.disabled;
                        break;
                }
                if (typeof this._text === "object" && this._text != null && currentState != null) {
                    switch (typeof currentState) {
                        case "number":
                            this._text.tint = currentState;
                            break;
                        case "object":
                            if (typeof this._text["style"] === "object" && this._text["style"] != null) {
                                for (var property in currentState)
                                    this._text["style"][property] = currentState[property];
                            }
                            break;
                    }
                }
            };
            Object.defineProperty(BasicButton.prototype, "isEnabled", {
                get: function () {
                    return this._isEnabled;
                },
                set: function (value) {
                    if (this._isEnabled != value) {
                        this._isEnabled = value;
                        if (!value)
                            this.onButtonUp(null);
                        this.buttonMode = value;
                        this.interactive = value;
                        this.emit("enabled", this._isEnabled);
                        this.resolveButtonState(this._state);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicButton.prototype, "text", {
                get: function () {
                    return this._text;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicButton.prototype, "state", {
                get: function () {
                    return this._state;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicButton.prototype, "angle", {
                get: function () {
                    return Math.round(1 / ((Math.PI / 180) / this.rotation));
                },
                set: function (value) {
                    this.rotation = ((Math.PI / 180) * value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicButton.prototype, "zIndex", {
                get: function () {
                    return this._zIndex;
                },
                set: function (value) {
                    this._zIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicButton.prototype, "keyCodes", {
                get: function () {
                    return this._codes;
                },
                enumerable: true,
                configurable: true
            });
            return BasicButton;
        }(PIXI.Sprite));
        Parts.BasicButton = BasicButton;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Dictionary = (function () {
    function Dictionary(init) {
        this._keys = [];
        this._values = [];
        for (var x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }
    Dictionary.prototype.add = function (key, value) {
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    };
    Dictionary.prototype.remove = function (key) {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        delete this[key];
    };
    return Dictionary;
}());
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var ParticleContainer = (function (_super) {
            __extends(ParticleContainer, _super);
            function ParticleContainer(parent, name, size, properties, batchSize) {
                var _this = _super.call(this, size, properties, batchSize) || this;
                _this._zIndex = 0;
                if (name)
                    _this.name = name;
                if (parent)
                    parent.addChild(_this);
                return _this;
            }
            ParticleContainer.prototype.sortChildren = function () {
                this.children.sort(function (a, b) {
                    a.zIndex = a.zIndex || 0;
                    b.zIndex = b.zIndex || 0;
                    return a.zIndex - b.zIndex;
                });
            };
            Object.defineProperty(ParticleContainer.prototype, "angle", {
                get: function () {
                    return Math.round(1 / ((Math.PI / 180) / this.rotation));
                },
                set: function (value) {
                    this.rotation = ((Math.PI / 180) * value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ParticleContainer.prototype, "zIndex", {
                get: function () {
                    return this._zIndex;
                },
                set: function (value) {
                    this._zIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            return ParticleContainer;
        }(PIXI.particles.ParticleContainer));
        Parts.ParticleContainer = ParticleContainer;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var Sprite = (function (_super) {
            __extends(Sprite, _super);
            function Sprite(x, y, frame, parent, name) {
                var _this = _super.call(this, (typeof frame === "string") ? PIXI.Texture.fromFrame(frame) : frame) || this;
                _this._zIndex = 0;
                _this.anchor.set(0.5, 0.5);
                _this.position.set(x, y);
                if (parent)
                    parent.addChild(_this);
                _this.name = name;
                return _this;
            }
            Object.defineProperty(Sprite.prototype, "angle", {
                get: function () {
                    return Math.round(1 / ((Math.PI / 180) / this.rotation));
                },
                set: function (value) {
                    this.rotation = ((Math.PI / 180) * value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "zIndex", {
                get: function () {
                    return this._zIndex;
                },
                set: function (value) {
                    this._zIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            return Sprite;
        }(PIXI.Sprite));
        Parts.Sprite = Sprite;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var ASCII_CHARACTER_CODES = {
            "31": "", "32": " ", "33": "!", "34": "\"", "35": "#",
            "36": "$", "37": "%", "38": "&", "39": "'", "40": "(",
            "41": ")", "42": "*", "43": "+", "44": ",", "45": "-",
            "46": ".", "47": "/", "48": "0", "49": "1", "50": "2",
            "51": "3", "52": "4", "53": "5", "54": "6", "55": "7",
            "56": "8", "57": "9", "58": ":", "59": ";", "60": "<",
            "61": "=", "62": ">", "63": "?", "64": "@", "65": "A",
            "66": "B", "67": "C", "68": "D", "69": "E", "70": "F",
            "71": "G", "72": "H", "73": "I", "74": "J", "75": "K",
            "76": "L", "77": "M", "78": "N", "79": "O", "80": "P",
            "81": "Q", "82": "R", "83": "S", "84": "T", "85": "U",
            "86": "V", "87": "W", "88": "X", "89": "Y", "90": "Z",
            "91": "[", "92": "\\", "93": "]", "94": "^", "95": "_",
            "96": "`", "97": "a", "98": "b", "99": "c", "100": "d",
            "101": "e", "102": "f", "103": "g", "104": "h", "105": "i",
            "106": "j", "107": "k", "108": "l", "109": "m", "110": "n",
            "111": "o", "112": "p", "113": "q", "114": "r", "115": "s",
            "116": "t", "117": "u", "118": "v", "119": "w", "120": "x",
            "121": "y", "122": "z", "123": "{", "124": "|", "125": "}",
            "126": "~", "127": ""
        };
        var SpriteText = (function (_super) {
            __extends(SpriteText, _super);
            function SpriteText(x, y, text, font, properties, parent) {
                var _this = _super.call(this, parent, "SpriteText") || this;
                _this._glyphs = [];
                _this._spacing = 5;
                _this._anchor = {
                    x: 0, y: 0, set: function (x, y) {
                        if (y === void 0) { y = null; }
                        if (typeof x === "number" && y == null) {
                            _this._anchor.x = x;
                            _this._anchor.y = x;
                        }
                        else {
                            _this._anchor.x = x;
                            _this._anchor.y = y;
                        }
                        _this.calculatePivot(_this._anchor.x, _this._anchor.y);
                    }
                };
                _this.anchor.set(0.5, 0.5);
                _this.position.set(x, y);
                _this._text = text;
                _this._font = font;
                _this.initProperties(properties);
                return _this;
            }
            SpriteText.prototype.initProperties = function (properties) {
                this.anchor.x = (properties && properties.anchor) ? properties.anchor.x : 0;
                this.anchor.y = (properties && properties.anchor) ? properties.anchor.y : 0;
                this.scale.x = (properties && properties.scale) ? properties.scale.x : 1;
                this.scale.y = (properties && properties.scale) ? properties.scale.y : 1;
                this._spacing = (properties && properties.spacing) ? properties.spacing : 5;
                this.generateText(this.text);
            };
            SpriteText.prototype.generateText = function (text) {
                try {
                    var w = 0;
                    var h = 0;
                    for (var gIndex = 0; gIndex < text.length; gIndex++) {
                        if (this._glyphs[gIndex]) {
                            this._glyphs[gIndex].position.set(w, 0);
                            this._glyphs[gIndex].texture = PIXI.Texture.fromFrame((this.font + "/" + text[gIndex].charCodeAt(0).toString()));
                        }
                        else
                            this._glyphs[gIndex] = new Parts.Sprite(w, 0, (this.font + "/" + text[gIndex].charCodeAt(0).toString()), this);
                        w += this._glyphs[gIndex].width + this.spacing;
                        h = (this._glyphs[gIndex].height > h) ? this._glyphs[gIndex].height : h;
                        if (gIndex == (text.length - 1))
                            this.pivot.set(((w -= this.spacing) * this.anchor.x), (h * this.anchor.y));
                    }
                    if (this._glyphs.length > text.length) {
                        var oldChars = this._glyphs.splice(text.length, (this._glyphs.length - text.length));
                        for (var oIndex = 0; oIndex < oldChars.length; oIndex++)
                            oldChars[oIndex].destroy({ children: true, baseTexture: true });
                        oldChars = null;
                    }
                }
                catch (e) {
                }
            };
            SpriteText.prototype.calculatePivot = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                var w = 0;
                var h = 0;
                for (var gIndex = 0; gIndex < this._glyphs.length; gIndex++) {
                    w += this._glyphs[gIndex].width + this.spacing;
                    h = (this._glyphs[gIndex].height > h) ? this._glyphs[gIndex].height : h;
                }
                this.pivot.set(((w -= this.spacing) * x), (h * y));
            };
            Object.defineProperty(SpriteText.prototype, "font", {
                get: function () {
                    return this._font;
                },
                set: function (value) {
                    if (this._font != value) {
                        this._font = value;
                        this.generateText(this.text);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteText.prototype, "text", {
                get: function () {
                    return this._text;
                },
                set: function (value) {
                    if (this._text != String(value)) {
                        this._text = String(value);
                        this.generateText(this.text);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteText.prototype, "spacing", {
                get: function () {
                    return this._spacing;
                },
                set: function (value) {
                    if (this._spacing != value) {
                        this._spacing = value;
                        this.generateText(this.text);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteText.prototype, "anchor", {
                get: function () {
                    return this._anchor;
                },
                enumerable: true,
                configurable: true
            });
            return SpriteText;
        }(Parts.Container));
        Parts.SpriteText = SpriteText;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parts;
    (function (Parts) {
        var ToggleButton = (function (_super) {
            __extends(ToggleButton, _super);
            function ToggleButton(x, y, callback, context, unselectedFrame, selectedFrame, isSelected, isUnselectable, parent, name) {
                if (isSelected === void 0) { isSelected = false; }
                if (isUnselectable === void 0) { isUnselectable = true; }
                var _this = _super.call(this, (isSelected == true) ? PIXI.Texture.fromFrame(selectedFrame) : PIXI.Texture.fromFrame(unselectedFrame)) || this;
                _this._zIndex = 0;
                _this._isPressed = false;
                _this._isEnabled = true;
                _this.anchor.set(0.5, 0.5);
                _this.position.set(x, y);
                _this.name = name;
                _this.buttonMode = true;
                _this.interactive = true;
                _this._callback = callback;
                _this._context = context;
                _this._isUnselectable = isUnselectable;
                _this._isSelected = isSelected;
                _this.setFrames(unselectedFrame, selectedFrame);
                _this.on("pointerout", _this.onButtonOut, _this);
                _this.on("pointerdown", _this.onButtonDown, _this);
                _this.on("pointerup", _this.onButtonUp, _this);
                if (parent)
                    parent.addChild(_this);
                return _this;
            }
            ToggleButton.prototype.setFrames = function (unselectedFrame, selectedFrame) {
                this._unselectedFrame = PIXI.Texture.fromFrame(unselectedFrame);
                this._selectedFrame = PIXI.Texture.fromFrame(selectedFrame);
                this.texture = (this._isSelected == true) ?
                    this._selectedFrame : this._unselectedFrame;
            };
            ToggleButton.prototype.onButtonOut = function () {
                this._isPressed = false;
            };
            ToggleButton.prototype.onButtonUp = function () {
                if (this._isEnabled == true && this._isPressed == true) {
                    if (this._isUnselectable == false) {
                        if (this.isSelected == false) {
                            this.isSelected = true;
                            if (this._callback)
                                this._callback.call(this._context, this);
                        }
                    }
                    else {
                        this.isSelected = !this.isSelected;
                        if (this._callback)
                            this._callback.call(this._context, this);
                    }
                    this._isPressed = false;
                }
            };
            ToggleButton.prototype.onButtonDown = function () {
                if (this._isEnabled == true)
                    this._isPressed = true;
            };
            Object.defineProperty(ToggleButton.prototype, "isSelected", {
                get: function () {
                    return this._isSelected;
                },
                set: function (value) {
                    if (this._isSelected != value) {
                        this._isSelected = value;
                        this.texture = (this._isSelected == true) ?
                            this._selectedFrame : this._unselectedFrame;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToggleButton.prototype, "isEnabled", {
                set: function (value) {
                    if (value != this._isEnabled) {
                        this._isEnabled = value;
                        this.buttonMode = value;
                        this.interactive = value;
                        this.tint = (this._isEnabled == true) ?
                            0xFFFFFF : 0x696969;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToggleButton.prototype, "angle", {
                get: function () {
                    return Math.round(1 / ((Math.PI / 180) / this.rotation));
                },
                set: function (value) {
                    this.rotation = ((Math.PI / 180) * value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToggleButton.prototype, "zIndex", {
                get: function () {
                    return this._zIndex;
                },
                set: function (value) {
                    this._zIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            return ToggleButton;
        }(PIXI.Sprite));
        Parts.ToggleButton = ToggleButton;
    })(Parts = Core.Parts || (Core.Parts = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Stages;
    (function (Stages) {
        var AssetLoader = (function (_super) {
            __extends(AssetLoader, _super);
            function AssetLoader() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            AssetLoader.prototype.init = function () {
                this._logoAnimation = new Core.Components.BrandLogo(this.game, 360, 345, true, this);
                this._logoAnimation.once(Core.ListenerType.animationcomplete, this.onLogoAnimationComplete, this);
                var barGraphics = new PIXI.Graphics();
                barGraphics.lineStyle(3, 0xFFFF00, 1);
                barGraphics.moveTo(0, 0);
                barGraphics.lineTo(0, 10);
                this._loadingBar = new Core.Parts.Sprite(490, 420, barGraphics.generateCanvasTexture(), this);
                this._loadingBar.anchor.set(0, 0.5);
                this._loadingBar.scale.set(0, 1);
                if (window.innerWidth > window.innerHeight) {
                    this._loadingBar.position.set(490, 420);
                }
                else {
                    this._loadingBar.position.set(220, 670);
                }
            };
            AssetLoader.prototype.dispose = function () {
                TweenLite.killTweensOf(this._loadingBar);
                this._loadingBarTween.kill();
                this._loadingBarTween = null;
            };
            AssetLoader.prototype.onLogoAnimationComplete = function () {
                var u = this.game.config.service.languageUrl;
                var i = this.game.config.service.gameId;
                var l = this.game.config.service.language;
                var v = this.game.config.service.languageVer;
                this.game.language.once("loadcomplete", this.onLanguageLoadComplete, this);
                this.game.language.once("loaderror", this.onLanguageLoadError, this);
                this.game.language.load(["assets/languages/" + l + ".json", "assets/languages/en.json"]);
            };
            AssetLoader.prototype.onLanguageLoadComplete = function () {
                Core.Game.instance.ResourceController.addResources();
                this.game.resource.on("loadprogress", this.onResLoadProgress, this);
                this.game.resource.once("loadcomplete", this.onResLoadComplete, this);
                this.game.resource.once("loaderror", this.onResLoadError, this);
                Core.Game.instance.resource.load();
            };
            AssetLoader.prototype.onLanguageLoadError = function () {
                throw "Error: Language Load Failed.";
            };
            AssetLoader.prototype.onResLoadProgress = function (progress) {
                this._loadingBar.scale.x = progress["default"];
            };
            AssetLoader.prototype.onResLoadComplete = function () {
                var _this = this;
                this._loadingBarTween = TweenLite.to(this._loadingBar, 0.85, {
                    alpha: 0.25, ease: Linear.easeNone, onComplete: function () {
                        TweenLite.to(_this._loadingBar, 0.85, {
                            alpha: 1, ease: Linear.easeNone, onComplete: function () {
                                _this._loadingBarTween.restart(false);
                            }
                        });
                    }
                });
                Core.Game.instance.service.once(Core.ListenerType.init, function (data) {
                    Core.Controller.DataController.Instance.initData(data);
                    Core.Controller.DataController.Instance.updateData(data);
                    Core.Essentials.GameUI.initUI(Core.Game.instance.service.config.gameUI, {
                        lang: Core.Game.instance.language.manifest.mobileUI,
                        paytable: Core.Game.instance.language.manifest.paytable,
                        currency: data.currency,
                        historyURL: data.gameHistoryUrl
                    });
                    Core.Game.instance.stage.start("MainStage", Stages.MainStage, true, false, null, "Default");
                }, this);
                Core.Game.instance.service.connect();
                Core.Game.instance.service.once(Core.ListenerType.error, function (type, action, message) {
                    switch (type) {
                        case "Status":
                        case "Parse":
                            Core.Game.instance.stage.start("ErrorPopup", Stages.Common.ErrorPopup, true, false, null, "Error_Parse", "Error_Parse");
                            break;
                        case "Websocket":
                            Core.Game.instance.stage.start("ErrorPopup", Stages.Common.ErrorPopup, true, false, null, "Error_WebSocketConnection", "Error_WebSocketConnection");
                            break;
                    }
                }, this);
                Core.Game.instance.service.once(Core.ListenerType.close, function (event) {
                    Core.Game.instance.stage.start("ErrorPopup", Stages.Common.ErrorPopup, true, false, null, "Error_WebSocketConnection", "Error_WebSocketConnection");
                }, this);
            };
            AssetLoader.prototype.onResLoadError = function (type) {
                throw "Error: Resource Load Failed (" + type + ").";
            };
            return AssetLoader;
        }(Core.Modules.Stage));
        Stages.AssetLoader = AssetLoader;
    })(Stages = Core.Stages || (Core.Stages = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Stages;
    (function (Stages) {
        var MainStage = (function (_super) {
            __extends(MainStage, _super);
            function MainStage() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MainStage.prototype.init = function () {
                this._soundController = new Core.Controller.SoundController();
                this._animationController = new Core.Controller.AnimationsController();
                this._animationController.stage = this;
                this.initProperties();
            };
            MainStage.prototype.initProperties = function () {
                this.updateData();
                this.createVisuals();
                this.setDisplayOrientation();
                this.initEvents();
                this._soundController.playAmbianceNormalSound();
                this._cardView.controller.setNewData();
                this._visualType = Core.VisualType.normal;
                this._bingoType = Core.BingoType.normal;
            };
            MainStage.prototype.initEvents = function () {
                var _this = this;
                Core.Game.instance.display.on(Core.ListenerType.orientationchange, function (change) {
                    _this.orientation = change;
                }, this);
                Core.Game.instance.display.on(Core.ListenerType.resize, function (change) {
                    _this.orientation = change;
                }, this);
            };
            MainStage.prototype.setDisplayOrientation = function () {
                window.innerWidth > window.innerHeight ? this.orientation = Core.DisplayOrientation.landscape : this.orientation = Core.DisplayOrientation.portrait;
            };
            MainStage.prototype.updateData = function () {
                var _this = this;
                Core.Game.instance.service.on(Core.ListenerType[Core.ListenerType.response], function (data) {
                    Core.Controller.DataController.Instance.updateData(data);
                    switch (data.clientAction) {
                        case Core.SendAction.globeSelect:
                            _this.visualType = Core.VisualType.forward;
                            _this.buttonState = Core.ButtonStateType.forward;
                            Core.Controller.AnimationsController.Instance.sortScenarioAnimation();
                            break;
                        case Core.SendAction.newCard:
                            _this.visualType = Core.VisualType.normal;
                            _this.buttonState = Core.ButtonStateType.response;
                            _this._cardView.controller.setNewData();
                            break;
                    }
                }, this);
            };
            Object.defineProperty(MainStage.prototype, "orientation", {
                set: function (orientation) {
                    this._betView.changeOrientation(orientation);
                    this._backgroundView.changeOrientation(orientation);
                    this._bingoMatrixView.changeOrientation(orientation);
                    this._payoutView.changeOrientation(orientation);
                    this._playView.changeOrientation(orientation);
                    this._turboView.changeOrientation(orientation);
                    this._machineView.changeOrientation(orientation);
                    this._cardView.changeOrientation(orientation);
                    this._bigWinPopupView.changeOrientation(orientation);
                    this._uiView.changeOrientation(orientation);
                    this._popupMV.changeOrientation(orientation);
                    this._orientation = orientation;
                },
                enumerable: true,
                configurable: true
            });
            MainStage.prototype.createVisuals = function () {
                this._backgroundView = new Core.View.BackgroundView(this);
                this._bingoMatrixView = new Core.View.MatrixView(this);
                this._betView = new Core.View.BetView(this);
                this._uiView = new Core.View.UIView(this);
                this._payoutView = new Core.View.PayoutView(this);
                this._playView = new Core.View.PlayView(this);
                this._turboView = new Core.View.TurboView(this);
                this._machineView = new Core.View.MachineView(this);
                this._cardView = new Core.View.CardView(this);
                this._bigWinPopupView = new Core.View.BigWinPopupView(this);
                this._popupMV = new Core.View.PopupMV(this);
            };
            Object.defineProperty(MainStage.prototype, "visualType", {
                set: function (type) {
                    if (this._visualType != type) {
                        this._playView.changeVisual(type);
                        this._machineView.changeVisual(type);
                        this._backgroundView.changeVisual(type);
                        this._bingoMatrixView.changeVisual(type);
                        this._playView.changeVisual(type);
                        this._turboView.changeVisual(type);
                        this._visualType = type;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "buttonState", {
                get: function () {
                    return this._buttonState;
                },
                set: function (buttonState) {
                    this._turboView.setButtonState(buttonState);
                    this._cardView.setButtonState(buttonState);
                    this._betView.setButtonState(buttonState);
                    this._playView.setButtonState(buttonState);
                    this._uiView.setButtonState(buttonState);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "bingoType", {
                get: function () {
                    return this._bingoType;
                },
                set: function (type) {
                    this._bingoType = type;
                },
                enumerable: true,
                configurable: true
            });
            MainStage.prototype.dispose = function () {
            };
            Object.defineProperty(MainStage.prototype, "cardView", {
                get: function () {
                    return this._cardView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "turboView", {
                get: function () {
                    return this._turboView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "playView", {
                get: function () {
                    return this._playView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "machineView", {
                get: function () {
                    return this._machineView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "bingoMatrixView", {
                get: function () {
                    return this._bingoMatrixView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "payoutView", {
                get: function () {
                    return this._payoutView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "betView", {
                get: function () {
                    return this._betView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "backgroundView", {
                get: function () {
                    return this._backgroundView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "bigwinPopupView", {
                get: function () {
                    return this._bigWinPopupView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "uiView", {
                get: function () {
                    return this._uiView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MainStage.prototype, "errorPopupMV", {
                get: function () {
                    return this._popupMV;
                },
                enumerable: true,
                configurable: true
            });
            return MainStage;
        }(Core.Modules.Stage));
        Stages.MainStage = MainStage;
    })(Stages = Core.Stages || (Core.Stages = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var BackgroundController = Core.Controller.BackgroundController;
        var BackgroundView = (function () {
            function BackgroundView(stage) {
                this._smokeAnim = [];
                this._stage = stage;
                this._backgroundController = new BackgroundController(this, stage);
                this.initProperties();
            }
            BackgroundView.prototype.initProperties = function () {
                this._backgroundContainer = new Core.Parts.Container(this._stage, "BackgroundContainer");
                this._baseContainer = new Core.Parts.Container(this._stage, "BaseContainer");
                this._coverContainer = new Core.Parts.Container(this._stage, "CoverContainer");
                this._portraitBackground = new Core.Parts.Sprite(360, 640, Core.StyleInformation.BackgroundFrames.PortraitNormalBackground, this._backgroundContainer, "PortaitBackground");
                this._landscapeBackground = new Core.Parts.Sprite(640, 360, Core.StyleInformation.BackgroundFrames.LandscapeNormalBackground, this._backgroundContainer, "LandscapeBackground");
                var dimGraphics = new PIXI.Graphics();
                dimGraphics.beginFill(0x000000, 1);
                dimGraphics.drawRect(0, 0, Core.DisplayResolution.width, Core.DisplayResolution.width);
                dimGraphics.endFill();
                this._backgroundBlack = new Core.Parts.Sprite(Core.DisplayResolution.width / 2, Core.DisplayResolution.width / 2, dimGraphics.generateCanvasTexture(), this._backgroundContainer, "BackgroundBlack");
                this._coverBottom = new Core.Parts.Sprite(360, 960, Core.StyleInformation.BackgroundFrames.CoverBottom, this._coverContainer, "CoverBottom");
                this._coverTop = new Core.Parts.Sprite(360, 322, Core.StyleInformation.BackgroundFrames.CoverTop, this._coverContainer, "CoverTop");
                this._coverRight = new Core.Parts.Sprite(960, 360, Core.StyleInformation.BackgroundFrames.CoverRight, this._coverContainer, "CoverRight");
                this._coverLeft = new Core.Parts.Sprite(322, 360, Core.StyleInformation.BackgroundFrames.CoverLeft, this._coverContainer, "CoverLeft");
                this._portraitLogo = new Core.Parts.Sprite(0, 283, Core.StyleInformation.BackgroundFrames.Logo, this._coverTop, "Logo");
                this._lanscapeLogo = new Core.Parts.Sprite(360, 238, Core.StyleInformation.BackgroundFrames.Logo, this._coverLeft, "Logo");
                var frame = Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.BackgroundSmokes.SmokeAnim1, 6, 19, "", 5);
                this._smokeAnim.push(new Core.Parts.AnimatedSprite(349, 452, frame, false, 0.35, this._backgroundContainer));
                frame = Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.BackgroundSmokes.SmokeAnim2, 20, 34, "", 5);
                this._smokeAnim.push(new Core.Parts.AnimatedSprite(1106, 308, frame, false, 0.35, this._backgroundContainer));
                frame = Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.BackgroundSmokes.SmokeAnim3, 19, 33, "", 5);
                this._smokeAnim.push(new Core.Parts.AnimatedSprite(257, 470, frame, false, 0.35, this._backgroundContainer));
                frame = Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.BackgroundSmokes.SmokeAnim3, 19, 33, "", 5),
                    this._smokeAnim.push(new Core.Parts.AnimatedSprite(193, 385, frame, false, 0.35, this._backgroundContainer));
                for (var i = 0; i < 4; i++)
                    this._smokeAnim[i].scale.set(.8, .8);
                this.playCoverOpenAnimation(Core.DisplayOrientation.landscape);
                this.playCoverOpenAnimation(Core.DisplayOrientation.portrait);
                this.playRandomSmokeAnimation();
            };
            BackgroundView.prototype.playCoverOpenAnimation = function (orientation) {
                if (orientation == Core.DisplayOrientation.portrait) {
                    TweenLite.to(this._coverTop, .8, { delay: .5, y: -240, ease: Sine.easeOut });
                    TweenLite.to(this._coverBottom, .8, { delay: .5, y: 1522, ease: Sine.easeOut });
                    TweenLite.to(this._portraitLogo.scale, .8, { delay: .5, y: 1, x: 1, ease: Sine.easeOut });
                }
                else {
                    TweenLite.to(this._coverLeft, .8, { delay: .5, x: -240, ease: Sine.easeOut });
                    TweenLite.to(this._coverRight, .8, { delay: .5, x: 1522, ease: Sine.easeOut });
                    TweenLite.to(this._lanscapeLogo.scale, .8, { delay: .5, y: .8, x: .8, ease: Sine.easeOut });
                }
                TweenLite.to(this._backgroundBlack, 1, { delay: .5, alpha: 0, ease: Sine.easeOut });
            };
            BackgroundView.prototype.playRandomSmokeAnimation = function () {
                var _this = this;
                var randomTime = (5 + Math.random()) * 10;
                var tweentime = new TimelineMax();
                tweentime.call(function () {
                    var randomSmoke = Math.floor((0 + Math.random()) * 4);
                    Core.Controller.SoundController.instance.playShortSmokeSound(randomSmoke % 2);
                    _this._smokeAnim[randomSmoke].resetAnimation();
                    _this._smokeAnim[randomSmoke].play();
                    _this.playRandomSmokeAnimation();
                }, null, null, "+=" + randomTime);
            };
            BackgroundView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        this._landscapeBackground.texture = PIXI.Texture.fromFrame(Core.StyleInformation.BackgroundFrames.LandscapeNormalBackground);
                        this._portraitBackground.texture = PIXI.Texture.fromFrame(Core.StyleInformation.BackgroundFrames.PortraitNormalBackground);
                        break;
                    case Core.VisualType.turbo:
                        this._landscapeBackground.texture = PIXI.Texture.fromFrame(Core.StyleInformation.BackgroundFrames.LandscapeTurboBackground);
                        this._portraitBackground.texture = PIXI.Texture.fromFrame(Core.StyleInformation.BackgroundFrames.PortraitTurboBackground);
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            BackgroundView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._smokeAnim[0].position.set(349, 452);
                        this._smokeAnim[1].position.set(1106, 308);
                        this._smokeAnim[2].position.set(257, 470);
                        this._smokeAnim[3].position.set(193, 385);
                        this._portraitBackground.visible = false;
                        this._landscapeBackground.visible = true;
                        this._coverBottom.visible = false;
                        this._coverTop.visible = false;
                        this._coverLeft.visible = true;
                        this._coverRight.visible = true;
                        this._portraitLogo.visible = false;
                        this._lanscapeLogo.visible = true;
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._smokeAnim[0].position.set(405, 913);
                        this._smokeAnim[1].position.set(505, 752);
                        this._smokeAnim[2].position.set(185, 574);
                        this._smokeAnim[3].position.set(96, 831);
                        this._portraitBackground.visible = true;
                        this._landscapeBackground.visible = false;
                        this._coverBottom.visible = true;
                        this._coverTop.visible = true;
                        this._coverLeft.visible = false;
                        this._coverRight.visible = false;
                        this._portraitLogo.visible = true;
                        this._lanscapeLogo.visible = false;
                        break;
                }
            };
            Object.defineProperty(BackgroundView.prototype, "baseContainer", {
                get: function () {
                    return this._baseContainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BackgroundView.prototype, "backgroundContainer", {
                get: function () {
                    return this._backgroundContainer;
                },
                enumerable: true,
                configurable: true
            });
            return BackgroundView;
        }());
        View.BackgroundView = BackgroundView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var BetController = Core.Controller.BetController;
        var BetView = (function () {
            function BetView(stage) {
                this._stage = stage;
                this._betController = new BetController(this, stage);
                this.initProperties();
            }
            BetView.prototype.initProperties = function () {
                this._container = new Core.Parts.Container(this._stage.backgroundView.baseContainer, "BetViewContainer");
                this._screenBetValue = new Core.Parts.Sprite(961, 430, Core.StyleInformation.BetScreen, this._container, "Screen");
                this._betValueText = Core.Game.instance.language.createText(Core.LanguageNames.BetValue, 0, 3, null, Core.StyleInformation.BetValue, this._screenBetValue);
                this._betMinButton = new Core.Parts.BasicButton(871, 430, this._betController.betButtonUp.bind(this._betController, Core.Controller.BetButtonType.Min), "", Core.StyleInformation.UI.BetDownButton, this._container, "BetDownButton");
                this._betPlusButton = new Core.Parts.BasicButton(1051, 430, this._betController.betButtonUp.bind(this._betController, Core.Controller.BetButtonType.Plus), "", Core.StyleInformation.UI.BetPlusButton, this._container, "BetPlusButton");
                this.betValueText = Core.Controller.DataController.Instance.betValues[Core.Controller.DataController.Instance.betIndex];
                this._betController.betStatus(Core.Controller.BetButtonType.Min);
                this._betController.betStatus(Core.Controller.BetButtonType.Plus);
                this.initEvents();
            };
            BetView.prototype.initEvents = function () {
                this._betMinButton.on('pointerdown', this._betController.betButtonDown.bind(this._betController, Core.Controller.BetButtonType.Min), this);
                this._betMinButton.on('pointerupoutside', this._betController.betButtonUp.bind(this._betController, Core.Controller.BetButtonType.Min), this);
                this._betPlusButton.on('pointerdown', this._betController.betButtonDown.bind(this._betController, Core.Controller.BetButtonType.Plus), this);
                this._betPlusButton.on('pointerupoutside', this._betController.betButtonUp.bind(this._betController, Core.Controller.BetButtonType.Plus), this);
            };
            BetView.prototype.setButtonState = function (state) {
                switch (state) {
                    case Core.ButtonStateType.response:
                        this._betController.betStatus(Core.Controller.BetButtonType.Min);
                        this._betController.betStatus(Core.Controller.BetButtonType.Plus);
                        break;
                    case Core.ButtonStateType.sendAction:
                        this._betMinButton.isEnabled = false;
                        this._betPlusButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.forward:
                        this._betMinButton.isEnabled = false;
                        this._betPlusButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.instant:
                        this._betMinButton.isEnabled = false;
                        this._betPlusButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.updateData:
                        this._betController.betStatus(Core.Controller.BetButtonType.Min);
                        this._betController.betStatus(Core.Controller.BetButtonType.Plus);
                        break;
                }
            };
            BetView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            BetView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._container.position.set(0, 0);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._container.position.set(-378, 486);
                        break;
                }
            };
            Object.defineProperty(BetView.prototype, "betValueText", {
                set: function (val) {
                    this._betValueText.text = (val / 100).toFixed(2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BetView.prototype, "controller", {
                get: function () {
                    return this._betController;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BetView.prototype, "mainStage", {
                get: function () {
                    return this._stage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BetView.prototype, "betMinButton", {
                get: function () {
                    return this._betMinButton;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BetView.prototype, "betPlusButton", {
                get: function () {
                    return this._betPlusButton;
                },
                enumerable: true,
                configurable: true
            });
            return BetView;
        }());
        View.BetView = BetView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var BigWinPopupController = Core.Controller.BigWinPopupController;
        var CoinsAnimation = (function () {
            function CoinsAnimation(parent) {
                this.stopBigWin = false;
                this.sprite = new Core.Parts.Sprite(640, 250, Core.StyleInformation.DolarBall, parent, "Coins");
                this.setCoinStartPosition(parent);
                this.stopBigWin = false;
            }
            CoinsAnimation.prototype.setCoinStartPosition = function (parent) {
                var direction = 0 + Math.random() * 2;
                direction < 1 ? this.randomDirection = -1 : this.randomDirection = 1;
                this.randomSpeed = Math.random() * 3 + 1;
                var randomPositionX = Math.random() * (100) + 640;
                var randomPositionY = 180;
                this.sprite.position.set(randomPositionX, randomPositionY);
                this.sprite.scale.set(.3, .3);
                this.increase = (-Math.PI / 120) * 2;
                this.counter = 0;
                this.i = 0;
            };
            CoinsAnimation.prototype.updateWayCoin = function (parent) {
                if (this.i > 3)
                    parent.visible = true;
                if (this.i <= 9) {
                    this.sprite.position.x += this.i * this.randomDirection * 2;
                    this.sprite.position.y += (Math.sin(this.counter) * this.i * 2 + 2) * 2;
                    this.sprite.scale.set(this.sprite.scale.x + 0.0032, this.sprite.scale.x + 0.0032);
                    this.i += (0.03 * this.randomSpeed);
                    this.counter += this.increase;
                }
                else {
                    if (!this.stopBigWin)
                        this.setCoinStartPosition(parent);
                }
            };
            return CoinsAnimation;
        }());
        var BigWinPopupView = (function () {
            function BigWinPopupView(stage) {
                this._isBigWinState = false;
                this._animationTimeline = new TimelineMax;
                this._coinsAnimations = [];
                this._stage = stage;
                this._bigWinPopupController = new BigWinPopupController(this, stage);
                this.initProperties();
            }
            BigWinPopupView.prototype.initProperties = function () {
                this._bigWinContainer = new Core.Parts.Container(this._stage.backgroundView.baseContainer, "BigWinContainer");
                this._coinsParticleContainer = new Core.Parts.Container(this._bigWinContainer, "CoinsParticleContainer");
                this._bigWinText = Core.Game.instance.language.createText(Core.LanguageNames.BigWinHeader, 704, 250, null, Core.StyleInformation.BigWinHeader, this._bigWinContainer);
                this._winValueText = Core.Game.instance.language.createText(Core.LanguageNames.BigWinValue, 704, 300, null, Core.StyleInformation.BigWinValue, this._bigWinContainer);
                this._mouth = new Core.Parts.Sprite(705, 432, Core.StyleInformation.MachineFrames.NormalMouth, this._bigWinContainer, "Mouth");
                this._mouth.visible = false;
                for (var i = 0; i < 100; i++)
                    this._coinsAnimations.push(new CoinsAnimation(this._coinsParticleContainer));
                this._coinsParticleContainer.visible = false;
                this._bigWinContainer.visible = false;
                this.createAnimationTimeline();
            };
            BigWinPopupView.prototype.createAnimationTimeline = function () {
                var _this = this;
                var tweenTime = 0.75;
                this._animationTimeline.to(this._stage.machineView.leftArm, tweenTime, {
                    y: 327, ease: Bounce.easeOut,
                    onStart: function () {
                        _this._stage.machineView.playNoseSmokeEffect();
                    },
                    onComplete: function () {
                        TweenMax.fromTo(_this._bigWinText.scale, .35, { x: 0, y: 0 }, { x: 1, y: 1, ease: Expo.easeInOut, autoKill: true });
                        TweenMax.fromTo(_this._winValueText.scale, .35, { x: 0, y: 0 }, { x: 1, y: 1, ease: Expo.easeInOut, autoKill: true });
                    }
                });
                this._animationTimeline.to(this._stage.machineView.rightArm, tweenTime, { y: 327, ease: Bounce.easeOut }, "=-" + tweenTime);
                this._animationTimeline.to(this._stage.machineView.mouth, tweenTime, { y: 370, ease: Sine.easeIn }, "=-" + tweenTime);
                this._animationTimeline.to(this._stage.machineView.mouth, tweenTime, { y: 406, ease: Bounce.easeOut,
                    onComplete: function () {
                        _this._mouth.visible = true;
                    }
                }, "=-" + tweenTime);
                this._animationTimeline.to(this._stage.machineView.teeth, tweenTime, { y: 213, ease: Sine.easeIn }, "=-" + tweenTime);
                this._animationTimeline.pause();
            };
            BigWinPopupView.prototype.playAnimation = function () {
                Core.Controller.SoundController.instance.stopBackgroundSound();
                Core.Controller.SoundController.instance.playBigWinSound();
                Core.Controller.SoundController.instance.playBigWinCounterSound();
                this._bigWinText.scale.set(0, 0);
                this._winValueText.scale.set(0, 0);
                this._winCoinsValue = Core.Controller.DataController.Instance.earnCoins;
                this.startBigWinCountAnimation(this._winCoinsValue);
                this._animationTimeline.restart();
                this._animationTimeline.play();
                this.startCountCoinAnimation();
                this._bigWinContainer.visible = true;
                this._coinsParticleContainer.visible = false;
            };
            BigWinPopupView.prototype.startCountCoinAnimation = function () {
                var _this = this;
                this._coinsParticleContainer.visible = false;
                var _loop_1 = function (i) {
                    Core.Game.instance.timer.addTimeout(Math.random(), function () {
                        _this._coinsAnimations[i].coinTimer = Core.Game.instance.timer.addInterval(0, _this._coinsAnimations[i].updateWayCoin.bind(_this._coinsAnimations[i], _this._coinsParticleContainer), _this, true);
                    }, this_1, true);
                    this_1._coinsAnimations[i].setCoinStartPosition(this_1._coinsParticleContainer);
                };
                var this_1 = this;
                for (var i = 0; i < this._coinsParticleContainer.children.length; i++) {
                    _loop_1(i);
                }
            };
            BigWinPopupView.prototype.startBigWinCountAnimation = function (coinsCount) {
                var _this = this;
                this._winValueText.text = "0";
                var listener = { value: 0 };
                TweenLite.to(listener, 5.5 - 0.1, {
                    value: coinsCount,
                    delay: 0.1,
                    ease: Sine.easeOut, onUpdate: function () {
                        _this._winValueText.text = listener.value.toFixed(0).toString();
                    }, onComplete: function () {
                        for (var i = 0; i < _this._coinsAnimations.length; i++) {
                            _this._coinsAnimations[i].stopBigWin = true;
                        }
                        TweenLite.fromTo(_this._winValueText.scale, .35, { x: 1, y: 1 }, { x: 1.2, y: 1.2, yoyo: true, repeat: -1, repeatDelay: .2, ease: Bounce.easeIn });
                        Core.Game.instance.timer.addTimeout(2, function () {
                            _this.stopBigWinAnimation();
                        }, null);
                    }
                });
            };
            BigWinPopupView.prototype.stopBigWinAnimation = function () {
                this._coinsParticleContainer.visible = false;
                var bigwinText = TweenMax.fromTo(this._bigWinText.scale, .2, { x: 1, y: 1 }, { x: 0, y: 0, autoKill: true, ease: Expo.easeOut });
                var winValueText = TweenMax.fromTo(this._winValueText.scale, .2, { x: 1, y: 1 }, { x: 0, y: 0, autoKill: true, ease: Expo.easeOut });
                this._mouth.visible = false;
                TweenLite.to(this._stage.machineView.leftArm, .35, { y: 271, ease: Sine.easeIn });
                TweenLite.to(this._stage.machineView.rightArm, .35, { y: 271, ease: Sine.easeIn });
                TweenLite.to(this._stage.machineView.mouth, .35, { y: 298, ease: Sine.easeIn, onComplete: function () { Core.Controller.AnimationsController.Instance.playNextAnimations(); } });
                for (var i = 0; i < this._coinsParticleContainer.children.length; i++) {
                    Core.Game.instance.timer.remove(this._coinsAnimations[i].coinTimer);
                    this._coinsAnimations[i].stopBigWin = false;
                }
            };
            BigWinPopupView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            BigWinPopupView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._coinsParticleContainer.position.set(26, 93);
                        this._mouth.position.set(705, 432);
                        this._bigWinText.position.set(704, 250);
                        this._winValueText.position.set(704, 335);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._coinsParticleContainer.position.set(-316, 558);
                        this._mouth.position.set(368, 897);
                        this._bigWinText.position.set(369, 724);
                        this._winValueText.position.set(369, 807);
                        break;
                }
            };
            Object.defineProperty(BigWinPopupView.prototype, "bigWinContainer", {
                get: function () {
                    return this._bigWinContainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BigWinPopupView.prototype, "winCoinsValue", {
                get: function () {
                    return this._winCoinsValue;
                },
                enumerable: true,
                configurable: true
            });
            return BigWinPopupView;
        }());
        View.BigWinPopupView = BigWinPopupView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var CardNumberController = Core.Controller.CardNumberController;
        var CardNumberView = (function () {
            function CardNumberView(cardView) {
                this._cardView = cardView;
                this._cardNumberController = new CardNumberController(cardView, this);
                this.initProperties();
            }
            CardNumberView.prototype.initProperties = function () {
                this._boxTexture = new Core.Parts.Sprite(453, 572, Core.StyleInformation.CardFrames.CardMatchBox, this._cardView.cardBoxContainer, "BoxTexture");
                this._numberText = Core.Game.instance.language.createText(Core.LanguageNames.CardNumberValue, 460, 572, null, Core.StyleInformation.CardNumberEmptyState, this._cardView.cardBoxContainer);
            };
            CardNumberView.prototype.playBoxAnim = function (numberState) {
                this._boxTexture.alpha = 0;
                switch (numberState) {
                    case Core.Controller.CardNumberState.Match:
                        TweenLite.to(this._boxTexture, .5, { alpha: 1, ease: Sine.easeIn });
                        this._boxTexture.texture = PIXI.Texture.fromFrame(Core.StyleInformation.CardFrames.CardMatchBox);
                        this._numberText.style = new PIXI.TextStyle(Core.StyleInformation.CardNumberMatchState);
                        break;
                    case Core.Controller.CardNumberState.Empty:
                        this._numberText.style = new PIXI.TextStyle(Core.StyleInformation.CardNumberEmptyState);
                        break;
                }
            };
            CardNumberView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            CardNumberView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        break;
                    case Core.DisplayOrientation.portrait:
                        break;
                }
            };
            CardNumberView.prototype.playCardNumberTextAnimation = function () {
                TweenLite.fromTo(this._numberText, .25, { alpha: 0 }, { alpha: 1, ease: Sine.easeIn });
            };
            CardNumberView.prototype.setValuesPosition = function (x, y) {
                this._numberText.position.set(x + 1, y);
                this._boxTexture.position.set(x, y - 2);
            };
            Object.defineProperty(CardNumberView.prototype, "numberText", {
                set: function (number) {
                    this._numberText.text = number.toString();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CardNumberView.prototype, "controller", {
                get: function () {
                    return this._cardNumberController;
                },
                enumerable: true,
                configurable: true
            });
            CardNumberView.prototype.destroy = function () {
                this._boxTexture.destroy();
                this._numberText.destroy();
            };
            Object.defineProperty(CardNumberView.prototype, "idNumber", {
                get: function () {
                    return this._numberId;
                },
                set: function (val) {
                    this._numberId = val;
                },
                enumerable: true,
                configurable: true
            });
            return CardNumberView;
        }());
        View.CardNumberView = CardNumberView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var CardController = Core.Controller.CardController;
        var CardView = (function () {
            function CardView(mainStage) {
                this._mainStage = mainStage;
                this._cardController = new CardController(this, mainStage);
                this.initProperties();
            }
            CardView.prototype.initProperties = function () {
                this._container = new Core.Parts.Container(this._mainStage.backgroundView.baseContainer, "CardContainer");
                this._cardTableContainer = new Core.Parts.Container(this._container, "CardTableContainer");
                this._cardButtonContainer = new Core.Parts.Container(this._container, "CardButtonContainer");
                this._cardTableBackround = new Core.Parts.Sprite(453, 572, Core.StyleInformation.CardFrames.CardBackground, this._cardTableContainer, "CardBackground");
                this._monitorAnim = new Core.Parts.AnimatedSprite(450, 572, Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.MonitorAnim, 0, 59, "", 5), false, 0.35, this._cardTableContainer);
                this._monitorAnim.scale.set(.6, .6);
                this._monitorAnim.play();
                this._cardTableFrame = new Core.Parts.Sprite(467, 577, Core.StyleInformation.CardFrames.CardFrame, this._container, "CardFrame");
                this._cardTableLines = new Core.Parts.Sprite(457, 572, Core.StyleInformation.CardFrames.CardLines, this._cardTableContainer, "CardLines");
                this._newCardButton = new Core.Parts.BasicButton(139, 632, this._cardController.newCardButtonUp.bind(this._cardController), "", Core.StyleInformation.UI.NewCardButton, this._cardButtonContainer, "NewCardButton");
                this._newCardText = Core.Game.instance.language.createText(Core.LanguageNames.NewCard, 450, 393, null, Core.StyleInformation.NewCard, this._cardButtonContainer);
                this._cardBoxContainer = new Core.Parts.Container(this._cardTableContainer, "CardButtonNumberContainer");
            };
            CardView.prototype.setButtonState = function (state) {
                switch (state) {
                    case Core.ButtonStateType.response:
                        this._newCardButton.isEnabled = true;
                        break;
                    case Core.ButtonStateType.sendAction:
                        this._newCardButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.forward:
                        this._newCardButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.instant:
                        this._newCardButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.updateData:
                        this._newCardButton.isEnabled = true;
                        break;
                }
            };
            CardView.prototype.playMonitorAnim = function () {
                this._monitorAnim.resetAnimation();
                this._monitorAnim.play();
            };
            CardView.prototype.playCardAnimation = function () {
                var _this = this;
                Core.Controller.SoundController.instance.playCardVibrationSound();
                TweenLite.fromTo(this._cardTableBackround, .35, { angle: -1 }, { angle: 1, yoyo: true, repeat: 2, repeatDelay: .2, ease: Bounce.easeIn });
                TweenLite.fromTo(this._cardTableLines, .35, { angle: -1 }, {
                    angle: 1, yoyo: true, repeat: 2, repeatDelay: .2, ease: Bounce.easeIn, onComplete: function () {
                        _this._cardTableBackround.angle = 0;
                        _this._cardTableLines.angle = 0;
                    }
                });
                this._cardController.updateCardData();
                this.playMonitorAnim();
            };
            CardView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._cardTableBackround.position.set(453, 572);
                        this._cardTableFrame.position.set(467, 577);
                        this._cardTableLines.position.set(450, 572);
                        this._newCardButton.position.set(451, 424);
                        this._cardTableBackround.scale.set(1, 1);
                        this._cardTableFrame.scale.set(1, 1);
                        this._cardTableLines.scale.set(1, 1);
                        this._newCardButton.scale.set(1, 1);
                        this._newCardText.position.set(450, 393);
                        this._cardBoxContainer.scale.set(1, 1);
                        this._cardBoxContainer.position.set(0, 0);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._cardTableBackround.position.set(363, 1073);
                        this._cardTableFrame.position.set(379, 1078);
                        this._cardTableLines.position.set(360, 1073);
                        this._newCardButton.position.set(178, 917);
                        this._cardTableBackround.scale.set(1.3, 1.3);
                        this._cardTableFrame.scale.set(1.2, 1.2);
                        this._cardTableLines.scale.set(1.2, 1.2);
                        this._newCardButton.scale.set(1, 1);
                        this._newCardText.position.set(176, 885);
                        this._cardBoxContainer.scale.set(1.2, 1.2);
                        this._cardBoxContainer.position.set(-180, 388);
                        break;
                }
            };
            CardView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            Object.defineProperty(CardView.prototype, "container", {
                get: function () {
                    return this._cardTableContainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CardView.prototype, "cardBoxContainer", {
                get: function () {
                    return this._cardBoxContainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CardView.prototype, "mainStage", {
                get: function () {
                    return this._mainStage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CardView.prototype, "controller", {
                get: function () {
                    return this._cardController;
                },
                enumerable: true,
                configurable: true
            });
            return CardView;
        }());
        View.CardView = CardView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Stages;
    (function (Stages) {
        var Common;
        (function (Common) {
            var ErrorPopup = (function (_super) {
                __extends(ErrorPopup, _super);
                function ErrorPopup() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ErrorPopup.prototype.init = function (header, context, args) {
                    this.popupBackground = new Core.Parts.Sprite(360, 360, Core.StyleInformation.Popup, this);
                    this.popupBackground.anchor.set(0.5, 0.5);
                    var popupContext = Core.Game.instance.language.createText(Core.LanguageNames.ErrorMessageHeader, 0, 0, null, Core.StyleInformation.ErrorMessageText, this.popupBackground);
                    popupContext.name = "ErrorPopupContext";
                    popupContext.anchor["set"](0.5, 0.5);
                    popupContext.text = Core.Game.instance.language.parse(context);
                    var popupButton = new Core.Parts.BasicButton(0, 111, this.onReloadButtonClick, this, Core.StyleInformation.UI.GeneralButton, this.popupBackground);
                    popupButton.name = 'PopupButton';
                    popupButton.anchor.set(0.5, 0.5);
                    this.popupBackground.addChild(popupButton);
                    var popupButtonText = Core.Game.instance.language.createText(Core.LanguageNames.GeneralButton, 0, 0, null, Core.StyleInformation.GeneralButton, this.popupBackground);
                    popupButtonText.name = 'PopupButtonText';
                    popupButtonText.text = Core.Game.instance.language.parse("ReloadButton");
                    popupButtonText.anchor['set'](0.5, 0.5);
                    popupButton.addChild(popupButtonText);
                    if (window.innerWidth > window.innerHeight) {
                        this.popupBackground.position.set(640, 360);
                    }
                    else {
                        this.popupBackground.position.set(360, 640);
                    }
                };
                ErrorPopup.prototype.onReloadButtonClick = function () {
                    if (location != null)
                        location.reload();
                };
                ErrorPopup.prototype.dispose = function () { };
                return ErrorPopup;
            }(Core.Modules.Stage));
            Common.ErrorPopup = ErrorPopup;
        })(Common = Stages.Common || (Stages.Common = {}));
    })(Stages = Core.Stages || (Core.Stages = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var MachineController = Core.Controller.MachineController;
        var MachineView = (function () {
            function MachineView(stage) {
                this._firsTimeTurbo = false;
                this._stage = stage;
                this._machineController = new MachineController(this, stage);
                this.initProperties();
            }
            MachineView.prototype.initProperties = function () {
                this._container = new Core.Parts.Container(this._stage.backgroundView.baseContainer, "MachineContainer");
                this._leftArm = new Core.Parts.Sprite(622, 271, Core.StyleInformation.MachineFrames.NormalLeftArm, this._container, "LeftArm");
                this._rightArm = new Core.Parts.Sprite(788, 271, Core.StyleInformation.MachineFrames.NormalRightArm, this._container, "RightArm");
                this._mouth = new Core.Parts.Sprite(705, 298, Core.StyleInformation.MachineFrames.NormalMouth, this._container, "Mouth");
                this._tempContainer = new Core.Parts.Container(this._container, "TempContainer");
                this._ball = new Core.Parts.Sprite(705, 202, Core.StyleInformation.MachineFrames.NormalBall, this._container, "Ball");
                this._ballText = Core.Game.instance.language.createText(Core.LanguageNames.BallValue, 0, 1, null, Core.StyleInformation.BallValue, this._ball);
                this._teeth = new Core.Parts.Sprite(705, 213, Core.StyleInformation.MachineFrames.NormalTeeth, this._container, "Teeth");
                this._wheel = new Core.Parts.Sprite(705, 172, Core.StyleInformation.MachineFrames.NormalWheel, this._container, "Wheel");
                this._head = new Core.Parts.Sprite(705, 137, Core.StyleInformation.MachineFrames.NormalHead, this._container, "Head");
                this._headLight = new Core.Parts.Sprite(705, 74, Core.StyleInformation.MachineFrames.Light, this._container, "HeadLight");
                this._headLight.alpha = 0;
                this._leftEyes = new Core.Parts.Sprite(655, 161, Core.StyleInformation.MachineFrames.NormalLeftEyes, this._container, "LeftEyes");
                this._rightEyes = new Core.Parts.Sprite(755, 161, Core.StyleInformation.MachineFrames.NormalRightEyes, this._container, "RightEyes");
                this._ball.scale.set(0.8, 0.8);
                var animation = Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.HeadSmokeEffect, 0, 21, "", 5);
                this._headLeftSmokeEffect = new Core.Parts.AnimatedSprite(570, 52, animation, false, 0.45, this._container);
                this._headLeftSmokeEffect.scale.set(.8, .8);
                this._headRightSmokeEffect = new Core.Parts.AnimatedSprite(840, 52, animation, false, 0.45, this._container);
                this._headRightSmokeEffect.scale.set(-0.8, 0.8);
                animation = Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.NoseSmokeEffect, 7, 30, "", 5);
                this._noseRightEffect = new Core.Parts.AnimatedSprite(761, 270, animation, false, 0.45, this._container);
                this._noseRightEffect.scale.set(-0.8, 0.8);
                this._noseLeftEffect = new Core.Parts.AnimatedSprite(652, 270, Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.NoseSmokeEffect, 7, 30, "", 5), false, 0.45, this._container);
                this._noseLeftEffect.scale.set(0.8, 0.8);
                animation = Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.HeadElectricEffect, 23, 41, "", 5);
                this._headElectic = new Core.Parts.AnimatedSprite(702, 0, animation, false, 0.45, this._container);
                this._headElectic.scale.set(0.6, 0.6);
                animation = Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.TurboSmokeEffect, 1, 21, "", 5);
                this._turboSmokeEffect = new Core.Parts.AnimatedSprite(714, 213, animation, false, 0.35, this._container);
                this._turboSmokeEffect.scale.set(.8, .8);
                this._resultLeftNumber = Core.Game.instance.language.createText(Core.LanguageNames.MachineHeadValue, 668, 47, null, Core.StyleInformation.MachineHeadValue, this._container);
                this._resultRightNumber = Core.Game.instance.language.createText(Core.LanguageNames.MachineHeadValue, 743, 47, null, Core.StyleInformation.MachineHeadValue, this._container);
                this._resultLeftNumber.rotation = -0.05;
                this._resultRightNumber.rotation = 0.05;
                this.playNoseSmokeEffect();
                this._firsTimeTurbo = true;
            };
            MachineView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._container.position.set(0, 26);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._container.position.set(-337, 491);
                        break;
                }
            };
            MachineView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        this._leftArm.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.NormalLeftArm);
                        this._rightArm.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.NormalRightArm);
                        this._mouth.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.NormalMouth);
                        this._ball.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.NormalBall);
                        this._teeth.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.NormalTeeth);
                        this._wheel.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.NormalWheel);
                        this._head.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.NormalHead);
                        this._leftEyes.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.NormalLeftEyes);
                        this._rightEyes.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.NormalRightEyes);
                        this._headElectic.animationSpeed = 0.45;
                        Core.Controller.SoundController.instance.stopBackgroundSound();
                        Core.Controller.SoundController.instance.playAmbianceNormalSound();
                        this._firsTimeTurbo = true;
                        break;
                    case Core.VisualType.turbo:
                        this._leftArm.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.TurboLeftArm);
                        this._rightArm.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.TurboRightArm);
                        this._mouth.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.TurboMouth);
                        this._ball.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.TurboBall);
                        this._teeth.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.TurboTeeth);
                        this._wheel.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.TurboWheel);
                        this._head.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.TurboHead);
                        this._leftEyes.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.TurboLeftEyes);
                        this._rightEyes.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MachineFrames.TurboRightEyes);
                        this._headElectic.animationSpeed = 1;
                        Core.Controller.SoundController.instance.stopBackgroundSound();
                        Core.Controller.SoundController.instance.playAmbianceTurboSound();
                        break;
                }
            };
            MachineView.prototype.playAnimation = function (tweenTime, counter) {
                switch (this._stage.bingoType) {
                    case Core.BingoType.normal:
                        Core.Controller.SoundController.instance.playCounterSound();
                        this.playNormalAnimation(tweenTime, counter);
                        break;
                    case Core.BingoType.turbo:
                        if (this._firsTimeTurbo)
                            tweenTime = tweenTime / 2;
                        this.playTurboAnimation(tweenTime, counter);
                        this._firsTimeTurbo = false;
                        break;
                    case Core.BingoType.stoppedAnimation:
                        this._animationTimeline.to(this._ball, tweenTime, { y: 202, ease: Expo.easeInOut });
                        this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 0, ease: Sine.easeIn }, "=-" + tweenTime);
                        this._animationTimeline.to(this._mouth, tweenTime, { y: 302, ease: Expo.easeInOut }, "=-" + tweenTime);
                        this._animationTimeline.to(this._rightArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                        this._animationTimeline.to(this._leftArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                        Core.Game.instance.timer.addTimeout(.5, Core.Controller.AnimationsController.Instance.playNextAnimations.bind(Core.Controller.AnimationsController.Instance), null);
                        break;
                    case Core.BingoType.instant:
                        this._animationTimeline.to(this._ball, tweenTime, { y: 202, ease: Expo.easeInOut });
                        this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 0, ease: Sine.easeIn }, "=-" + tweenTime);
                        this._animationTimeline.to(this._mouth, tweenTime, { y: 298, ease: Expo.easeInOut }, "=-" + tweenTime);
                        this._animationTimeline.to(this._rightArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                        this._animationTimeline.to(this._leftArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                        this._animationTimeline.to(this._teeth, tweenTime, { y: 213, ease: Expo.easeInOut }, "=-" + tweenTime);
                        this._machineController.showResult();
                        break;
                    case Core.BingoType.connectionLost:
                        this._animationTimeline.to(this._ball, tweenTime, { y: 202, ease: Expo.easeInOut });
                        this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 0, ease: Sine.easeIn }, "=-" + tweenTime);
                        this._animationTimeline.to(this._mouth, tweenTime, { y: 302, ease: Expo.easeInOut }, "=-" + tweenTime);
                        this._animationTimeline.to(this._rightArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                        this._animationTimeline.to(this._leftArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                        break;
                }
            };
            MachineView.prototype.playNormalAnimation = function (tweenTime, counter) {
                var _this = this;
                this.stopAnimation();
                this._animationTimeline = new TimelineMax();
                var resultValues = Core.Controller.DataController.Instance.resultValues;
                this._stage.machineView.playHeadSmokeEffect();
                this._animationTimeline.to(this._leftArm, tweenTime / 2, { y: 300, ease: Sine.easeIn, onStart: function () { _this._stage.machineView.playNoseSmokeEffect(); } }, "=-" + tweenTime);
                this._animationTimeline.to(this._rightArm, tweenTime / 2, { y: 300, ease: Sine.easeIn }, "=-" + tweenTime);
                this._animationTimeline.to(this._leftArm, tweenTime / 2, { y: 327, ease: Bounce.easeOut });
                this._animationTimeline.to(this._rightArm, tweenTime / 2, { y: 327, ease: Bounce.easeOut }, "=-" + tweenTime / 2);
                this._animationTimeline.to(this._teeth, tweenTime / 2, { y: 213, ease: Sine.easeIn }, "=-" + tweenTime);
                this._animationTimeline.to(this._leftEyes, tweenTime / 2, { rotation: Math.PI + Math.random() * 2 * Math.PI, ease: Sine.easeIn }, "=-" + tweenTime);
                this._animationTimeline.to(this._rightEyes, tweenTime / 2, { rotation: Math.PI + Math.random() * 2 * Math.PI, ease: Sine.easeIn }, "=-" + tweenTime);
                this._animationTimeline.to(this._mouth, tweenTime / 2, { y: 370, ease: Sine.easeIn }, "=-" + tweenTime);
                this._animationTimeline.to(this._mouth, tweenTime / 2, { y: 406, ease: Bounce.easeOut }, "=-" + tweenTime / 2);
                this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 2, ease: Sine.easeIn }, "=-" + tweenTime);
                this._animationTimeline.to(this._ball, tweenTime / 2, {
                    y: 303, ease: Sine.easeIn,
                    onStart: function () {
                        _this._ballText.text = resultValues[counter].toString();
                        _this._stage.machineView.playHeadValueAnimation(Math.floor(resultValues[counter] / 10), resultValues[counter] % 10);
                    },
                    onComplete: function () {
                        _this._machineController.checkMatchValues(counter);
                    }
                }, "=-" + tweenTime / 2);
                this._animationTimeline.to(this._ball, tweenTime / 2, { y: 308, ease: Bounce.easeOut });
                this._animationTimeline.to(this._ball, tweenTime, { y: 195, ease: Sine.easeOut }, "=+" + tweenTime / 2);
                this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 0, ease: Sine.easeOut }, "=-" + tweenTime);
                this._animationTimeline.to(this._mouth, tweenTime, { y: 295, ease: Sine.easeOut }, "=-" + tweenTime);
                this._animationTimeline.to(this._rightArm, tweenTime, { y: 271, ease: Sine.easeOut }, "=-" + tweenTime);
                this._animationTimeline.to(this._leftArm, tweenTime, { y: 271, ease: Sine.easeOut }, "=-" + tweenTime);
                this._animationTimeline.to(this._teeth, tweenTime, { y: 210, ease: Elastic.easeOut }, "=-" + tweenTime / 4);
                this._animationTimeline.call(function () {
                    if (_this._machineController.matchCount != _this._stage.cardView.controller.cardNumberView.length) {
                        counter++;
                        _this.playAnimation(tweenTime, counter);
                    }
                    else {
                        Core.Game.instance.timer.addTimeout(.5, Core.Controller.AnimationsController.Instance.playNextAnimations.bind(Core.Controller.AnimationsController.Instance), null);
                    }
                });
            };
            MachineView.prototype.playTurboAnimation = function (tweenTime, counter) {
                var _this = this;
                this.stopAnimation();
                this._animationTimeline = new TimelineMax();
                var resultValues = Core.Controller.DataController.Instance.resultValues;
                var ball, ballText;
                this._leftArm.position.set(this._leftArm.position.x, 327);
                this._rightArm.position.set(this._rightArm.position.x, 327);
                this._mouth.position.set(this._mouth.position.x, 406);
                this._animationTimeline.to(this._leftEyes, tweenTime / 2, { rotation: Math.PI * 2 + Math.random() * 10 * Math.PI, ease: Sine.easeIn });
                this._animationTimeline.to(this._rightEyes, tweenTime / 2, { rotation: Math.PI * 2 + Math.random() * 10 * Math.PI, ease: Sine.easeIn }, "=-" + tweenTime / 2);
                this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: Math.PI * 2, ease: Sine.easeIn }, "=-" + tweenTime / 2);
                this._animationTimeline.to(this._ball, tweenTime / 2, {
                    y: 303, ease: Sine.easeIn,
                    onStart: function () {
                        ball = new Core.Parts.Sprite(705, 308, Core.StyleInformation.MachineFrames.TurboBall, _this._tempContainer, "Ball");
                        ballText = Core.Game.instance.language.createText(Core.LanguageNames.BallValue, 0, 1, null, Core.StyleInformation.BallValue, ball);
                        ball.scale.set(.8, .8);
                        ballText.text = resultValues[counter].toString();
                        _this._ballText.text = resultValues[counter].toString();
                        _this._stage.machineView.playHeadValueAnimation(Math.floor(resultValues[counter] / 10), resultValues[counter] % 10);
                    },
                    onComplete: function () {
                        _this._machineController.checkMatchValues(counter);
                    }
                }, "=-" + tweenTime / 2);
                this._animationTimeline.to(this._ball, tweenTime / 2, { y: 308, ease: Bounce.easeOut });
                this._animationTimeline.call(function () {
                    if (_this._machineController.matchCount != _this._stage.cardView.controller.cardNumberView.length) {
                        counter++;
                        _this.playAnimation(tweenTime, counter);
                    }
                    else {
                        _this._stage.bingoType = Core.BingoType.stoppedAnimation;
                        _this.playAnimation(.5, counter);
                    }
                    ball.destroy();
                    ballText.destroy();
                });
            };
            MachineView.prototype.playHeadValueAnimation = function (valueLeft, valueRight) {
                var _this = this;
                this._resultRightNumber.text = valueRight.toString();
                this._resultLeftNumber.text = valueLeft.toString();
                var leftnumbertween;
                var rightnumbertween;
                switch (this._stage.bingoType) {
                    case Core.BingoType.normal:
                        leftnumbertween = .25;
                        rightnumbertween = .45;
                        break;
                    case Core.BingoType.turbo:
                        leftnumbertween = .15;
                        rightnumbertween = .25;
                        break;
                }
                TweenLite.killTweensOf(this._resultLeftNumber);
                TweenLite.killTweensOf(this._headLight);
                TweenLite.killTweensOf(this._resultRightNumber);
                TweenLite.fromTo(this._resultLeftNumber, leftnumbertween, { alpha: 0 }, { alpha: 1, ease: Expo.easeIn,
                    onComplete: function () {
                        TweenLite.fromTo(_this._resultLeftNumber, leftnumbertween, { alpha: 1 }, { alpha: 0, ease: Elastic.easeOut, delay: .5 });
                    }
                });
                TweenLite.fromTo(this._resultRightNumber, leftnumbertween, { alpha: 0 }, { alpha: 1, ease: Expo.easeIn,
                    onComplete: function () {
                        TweenLite.fromTo(_this._resultRightNumber, rightnumbertween, { alpha: 1 }, { alpha: 0, ease: Elastic.easeOut, delay: .5 });
                    }
                });
                TweenLite.fromTo(this._headLight, leftnumbertween, { alpha: 0 }, { alpha: 1, ease: Expo.easeIn,
                    onComplete: function () {
                        TweenLite.fromTo(_this._headLight, rightnumbertween, { alpha: 1 }, { alpha: 0, ease: Elastic.easeOut, delay: .5 });
                    }
                });
            };
            MachineView.prototype.playHeadElectricEffect = function () {
                if (this._stage.bingoType == Core.BingoType.normal)
                    Core.Controller.SoundController.instance.playElectricNormalSound();
                this._headElectic.resetAnimation();
                this._headElectic.play();
            };
            MachineView.prototype.playNoseSmokeEffect = function () {
                this._noseRightEffect.resetAnimation();
                this._noseRightEffect.play();
                this._noseLeftEffect.resetAnimation();
                this._noseLeftEffect.play();
                Core.Controller.SoundController.instance.playNoseSmokeSound();
            };
            MachineView.prototype.playHeadSmokeEffect = function () {
                this._headLeftSmokeEffect.resetAnimation();
                this._headLeftSmokeEffect.play();
                this._headRightSmokeEffect.resetAnimation();
                this._headRightSmokeEffect.play();
                Core.Controller.SoundController.instance.playHeadSmokeSound();
            };
            MachineView.prototype.stopAnimation = function () {
                if (this._animationTimeline) {
                    this._animationTimeline.progress(0, true);
                    this._animationTimeline.kill();
                    this._animationTimeline = null;
                }
            };
            Object.defineProperty(MachineView.prototype, "turboSmokeEffect", {
                get: function () {
                    return this._turboSmokeEffect;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MachineView.prototype, "controller", {
                get: function () {
                    return this._machineController;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MachineView.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MachineView.prototype, "leftArm", {
                get: function () {
                    return this._leftArm;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MachineView.prototype, "rightArm", {
                get: function () {
                    return this._rightArm;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MachineView.prototype, "mouth", {
                get: function () {
                    return this._mouth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MachineView.prototype, "teeth", {
                get: function () {
                    return this._teeth;
                },
                enumerable: true,
                configurable: true
            });
            return MachineView;
        }());
        View.MachineView = MachineView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var MatrixBoxView = (function () {
            function MatrixBoxView(matrixView) {
                this._matrixView = matrixView;
                this._matrixBoxController = new Core.Controller.MatrixBoxController(matrixView, this);
                this.initProperties();
            }
            MatrixBoxView.prototype.initProperties = function () {
                this._boxTexture = new Core.Parts.Sprite(453, 572, Core.StyleInformation.MatrixFrames.BoxMatch, this._matrixView.matrixBoxContainer, "BoxTexture");
                this._numberText = Core.Game.instance.language.createText(Core.LanguageNames.MatrixNumberValue, 395, 72, null, Core.StyleInformation.MatrixEmptyState, this._matrixView.matrixBoxContainer);
            };
            MatrixBoxView.prototype.setValuesPosition = function (x, y) {
                this._numberText.position.set(x, y);
                this._boxTexture.position.set(x, y - 2);
            };
            MatrixBoxView.prototype.playBoxAnim = function (numberState) {
                this._boxTexture.alpha = 0;
                TweenLite.killTweensOf(this._boxTexture);
                switch (numberState) {
                    case Core.Controller.MatrixBoxStateType.OnScreen:
                        TweenLite.to(this._boxTexture, .25, { alpha: 1, ease: Sine.easeIn });
                        this._boxTexture.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MatrixFrames.BoxOnScreen);
                        this._numberText.style = new PIXI.TextStyle(Core.StyleInformation.MatrixNumberOnSceenState);
                        break;
                    case Core.Controller.MatrixBoxStateType.Match:
                        TweenLite.to(this._boxTexture, .25, { alpha: 1, ease: Sine.easeIn });
                        this._boxTexture.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MatrixFrames.BoxMatch);
                        this._numberText.style = new PIXI.TextStyle(Core.StyleInformation.MatrixMatchState);
                        break;
                    case Core.Controller.MatrixBoxStateType.Empty:
                        this._numberText.style = new PIXI.TextStyle(Core.StyleInformation.MatrixEmptyState);
                        break;
                    case Core.Controller.MatrixBoxStateType.Pass:
                        TweenLite.to(this._boxTexture, .25, { alpha: 1, ease: Sine.easeIn });
                        this._boxTexture.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MatrixFrames.BoxPass);
                        this._numberText.style = new PIXI.TextStyle(Core.StyleInformation.MatrixNumberPassState);
                        break;
                }
            };
            MatrixBoxView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        break;
                    case Core.DisplayOrientation.portrait:
                        break;
                }
            };
            MatrixBoxView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            Object.defineProperty(MatrixBoxView.prototype, "numberValueText", {
                set: function (number) {
                    this._numberText.text = number.toString();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MatrixBoxView.prototype, "controller", {
                get: function () {
                    return this._matrixBoxController;
                },
                enumerable: true,
                configurable: true
            });
            return MatrixBoxView;
        }());
        View.MatrixBoxView = MatrixBoxView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var MatrixView = (function () {
            function MatrixView(stage) {
                this._matrixBoxView = [];
                this._stage = stage;
                this._matrixController = new Core.Controller.MatrixController(this, stage);
                this.initProperties();
            }
            MatrixView.prototype.initProperties = function () {
                this._container = new Core.Parts.Container(this._stage.backgroundView.baseContainer, "MatrixContainer");
                this._background = new Core.Parts.Sprite(396, 205, Core.StyleInformation.MatrixFrames.Background, this._container, "MatrixBackground");
                this._matrixBoxContainer = new Core.Parts.Container(this._container, "MatrixBoxContainer");
                this.createMatrixBoxes(0, 0, 1);
                this._frame = new Core.Parts.Sprite(399, 216, Core.StyleInformation.MatrixFrames.FrameNormal, this._container, "BingoMatrixFrame");
                this._headerText = Core.Game.instance.language.createText(Core.LanguageNames.MatrixHeader, 395, 5, null, Core.StyleInformation.MatrixHeader, this._container);
                this._headerValueText = Core.Game.instance.language.createText(Core.LanguageNames.MatrixHeaderValue, 395, 34, null, Core.StyleInformation.MatrixHeaderValue, this._container);
            };
            MatrixView.prototype.createMatrixBoxes = function (rIndex, cIndex, count) {
                if (rIndex >= 9)
                    return;
                var xOffSet = 26;
                var yOffSet = 26;
                var number = new View.MatrixBoxView(this);
                number.controller.numberValue = count;
                number.controller.setNumberPosition(278 + cIndex % 10 * xOffSet, 98 + rIndex * yOffSet);
                number.controller.numberStateType = Core.Controller.MatrixBoxStateType.Empty;
                this._matrixBoxView.push(number);
                count++;
                cIndex++;
                if (cIndex % 10 == 0)
                    rIndex++;
                this.createMatrixBoxes(rIndex, cIndex % 10, count);
            };
            MatrixView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        this._frame.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MatrixFrames.FrameNormal);
                        break;
                    case Core.VisualType.turbo:
                        this._frame.texture = PIXI.Texture.fromFrame(Core.StyleInformation.MatrixFrames.FrameTurbo);
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            MatrixView.prototype.changeHeaderText = function (val) {
                val == 0 ? this._headerValueText.text = "" : this._headerValueText.text = val.toString();
            };
            MatrixView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._container.position.set(0, 13);
                        this._container.scale.set(1, 1);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._container.position.set(-237, 122);
                        this._container.scale.set(1.1, 1.1);
                        break;
                }
            };
            Object.defineProperty(MatrixView.prototype, "matrixBoxView", {
                get: function () {
                    return this._matrixBoxView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MatrixView.prototype, "controller", {
                get: function () {
                    return this._matrixController;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MatrixView.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MatrixView.prototype, "matrixBoxContainer", {
                get: function () {
                    return this._matrixBoxContainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MatrixView.prototype, "mainStage", {
                get: function () {
                    return this._stage;
                },
                enumerable: true,
                configurable: true
            });
            return MatrixView;
        }());
        View.MatrixView = MatrixView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var PayoutSelectorController = Core.Controller.PayoutSelectorController;
        var PayoutSelectorView = (function () {
            function PayoutSelectorView(payoutView) {
                this._payoutView = payoutView;
                this._payoutSelectorController = new PayoutSelectorController(payoutView, this);
                this.initProperties();
            }
            PayoutSelectorView.prototype.initProperties = function () {
                this._indicator = new Core.Parts.Sprite(959, 88, Core.StyleInformation.PayoutFrames.Indicator, this._payoutView.payoutSelectorContainer, "Indicator");
                this._indicator.scale.set(1.05, 1.05);
                this._lineMatch = new Core.Parts.Sprite(959, 88, Core.StyleInformation.PayoutFrames.LineMatch, this._payoutView.payoutSelectorContainer, "LineMatch");
                this._lineMatch.scale.set(.75, 1);
                var language = Core.LanguageNames.PayoutSelectorBallsCounterValue;
                var style = Core.StyleInformation.PayoutSelectorBallsEmptyState;
                this._ballsCounterText = Core.Game.instance.language.createText(language, 885, 89, null, style, this._payoutView.payoutSelectorContainer, Core.Anchor.left);
                language = Core.LanguageNames.PayoutSelectorValue;
                style = Core.StyleInformation.PayoutSelectorEmptyState;
                this._valueText = Core.Game.instance.language.createText(language, 1033, 89, null, style, this._payoutView.payoutSelectorContainer, Core.Anchor.right);
            };
            PayoutSelectorView.prototype.valuesPosition = function (x, y) {
                this._indicator.position.set(x, y - 1);
                this._ballsCounterText.position.set(x - 20, y);
                this._valueText.position.set(x + 20, y);
                this._lineMatch.position.set(x - 1, y);
            };
            PayoutSelectorView.prototype.setValues = function (ballsCounter, value) {
                this._ballsCounter = ballsCounter;
                this._ballsCounterText.text = Core.Game.instance.language.parse(Core.LanguageNames.PayoutSelectorBallsCounterValue, this._ballsCounter);
                this._valueText.text = Core.Controller.DataController.Instance.resolveFormat(value / 100);
            };
            PayoutSelectorView.prototype.playSelectorAnim = function (numberState) {
                this._indicator.alpha = 0;
                this._lineMatch.alpha = 0;
                switch (numberState) {
                    case Core.Controller.IndicatorState.Match:
                        this._indicator.alpha = 1;
                        this._lineMatch.alpha = 1;
                        this._ballsCounterText.style = new PIXI.TextStyle(Core.StyleInformation.PayoutSelectorBallsMatchState);
                        this._valueText.style = new PIXI.TextStyle(Core.StyleInformation.PayoutSelectorMatchState);
                        break;
                    case Core.Controller.IndicatorState.Empty:
                        this._ballsCounterText.style = new PIXI.TextStyle(Core.StyleInformation.PayoutSelectorBallsEmptyState);
                        this._valueText.style = new PIXI.TextStyle(Core.StyleInformation.PayoutSelectorEmptyState);
                        break;
                    case Core.Controller.IndicatorState.Loop:
                        this._lineMatch.alpha = 1;
                        this._indicator.alpha = 1;
                        TweenMax.to(this._indicator.scale, 1.06, { x: 1.12, y: 1.08, repeat: -1, yoyo: true, ease: Power2.easeInOut });
                        TweenMax.to(this._ballsCounterText.scale, 1.05, { x: 1.08, y: 1.08, repeat: -1, yoyo: true, ease: Power2.easeInOut });
                        TweenMax.to(this._valueText.scale, 1.05, { x: 1.08, y: 1.08, repeat: -1, yoyo: true, ease: Power2.easeInOut });
                        break;
                }
            };
            PayoutSelectorView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            PayoutSelectorView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        break;
                    case Core.DisplayOrientation.portrait:
                        break;
                }
            };
            Object.defineProperty(PayoutSelectorView.prototype, "ballsCounter", {
                get: function () {
                    return this._ballsCounter;
                },
                enumerable: true,
                configurable: true
            });
            PayoutSelectorView.prototype.destroy = function () {
                this._indicator.destroy();
                this._lineMatch.destroy();
                this._ballsCounterText.destroy();
                this._valueText.destroy();
            };
            Object.defineProperty(PayoutSelectorView.prototype, "controller", {
                get: function () {
                    return this._payoutSelectorController;
                },
                enumerable: true,
                configurable: true
            });
            return PayoutSelectorView;
        }());
        View.PayoutSelectorView = PayoutSelectorView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var PayoutController = Core.Controller.PayoutController;
        var PayoutView = (function () {
            function PayoutView(stage) {
                this._stage = stage;
                this._payoutController = new PayoutController(this, stage);
                this.initProperties();
            }
            PayoutView.prototype.initProperties = function () {
                this._container = new Core.Parts.Container(this._stage.backgroundView.baseContainer, "PayoutContainer");
                this._background = new Core.Parts.Sprite(959, 191, Core.StyleInformation.PayoutFrames.Background, this._container, "PayoutBackground");
                this._frame = new Core.Parts.Sprite(975, 191, Core.StyleInformation.PayoutFrames.FrameNormal, this._container, "PayoutFrame");
                this._ballsLine = new Core.Parts.Sprite(958, 194, Core.StyleInformation.PayoutFrames.BallsLine, this._container, "PayoutBallsLine");
                this._ballsLine.scale.set(.7, 1);
                this._payoutSelectorContainer = new Core.Parts.Container(this._container, "PayoutSelectorContainer");
            };
            PayoutView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            PayoutView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._container.scale.set(1, 1);
                        this._container.position.set(0, 0);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._container.scale.set(1.2, 1.2);
                        this._container.position.set(-577, 100);
                        break;
                }
            };
            Object.defineProperty(PayoutView.prototype, "controller", {
                get: function () {
                    return this._payoutController;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PayoutView.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PayoutView.prototype, "payoutSelectorContainer", {
                get: function () {
                    return this._payoutSelectorContainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PayoutView.prototype, "mainStage", {
                get: function () {
                    return this._stage;
                },
                enumerable: true,
                configurable: true
            });
            return PayoutView;
        }());
        View.PayoutView = PayoutView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var PlayController = Core.Controller.PlayController;
        var PlayView = (function () {
            function PlayView(stage) {
                this._stage = stage;
                this._playController = new PlayController(this, stage);
                this.initProperties();
            }
            PlayView.prototype.initProperties = function () {
                this._container = new Core.Parts.Container(this._stage.backgroundView.baseContainer, "PlayContainer");
                this._playButton = new Core.Parts.BasicButton(0, 0, this._playController.playButtonUp.bind(this._playController), "", Core.StyleInformation.UI.PlayButton, this._container, "PlayButton");
                var sideMask = new PIXI.Graphics();
                sideMask.beginFill(0xffffff, 1);
                sideMask.drawCircle(0, -3, 89);
                sideMask.endFill();
                this._container.addChild(sideMask);
                this._playButton.mask = sideMask;
            };
            PlayView.prototype.playButtonEffect = function () {
                this._playButtonEffect.resetAnimation();
                this._playButtonEffect.play();
                this._playButtonEffect.onComplete = function () {
                };
            };
            PlayView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._container.position.set(997, 572);
                        this._container.scale.set(1, 1);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._container.position.set(584, 670);
                        this._container.scale.set(1.3, 1.3);
                        break;
                }
            };
            PlayView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        this._playButton.setFrames(Core.StyleInformation.UI.PlayButton);
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        this._playButton.setFrames(Core.StyleInformation.UI.ForwardButton);
                        break;
                }
            };
            PlayView.prototype.setButtonState = function (state) {
                switch (state) {
                    case Core.ButtonStateType.response:
                        this._playButton.isEnabled = true;
                        break;
                    case Core.ButtonStateType.sendAction:
                        this._playButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.forward:
                        this._playButton.isEnabled = true;
                        break;
                    case Core.ButtonStateType.instant:
                        this._playButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.updateData:
                        this._playButton.isEnabled = true;
                        break;
                }
            };
            Object.defineProperty(PlayView.prototype, "controller", {
                get: function () {
                    return this._playController;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlayView.prototype, "playButton", {
                get: function () {
                    return this._playButton;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlayView.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            return PlayView;
        }());
        View.PlayView = PlayView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var PopupController = Core.Controller.PopupController;
        var PopupButtonType = Core.Controller.PopupButtonType;
        var PopupMV = (function () {
            function PopupMV(stage) {
                this._stage = stage;
                this._popupController = new PopupController(this, stage);
                this.initProperties();
            }
            PopupMV.prototype.initProperties = function () {
                this._popupContainer = new Core.Parts.Container(this._stage, "ErrorPopupContainer");
                this._popupContainer.alpha = 0;
                this._popupContainer.visible = false;
                this._background = new Core.Parts.Sprite(640, 360, Core.StyleInformation.BackgroundFrames.Black, this._popupContainer, "Background");
                this._background.scale.set(10, 10);
                this._background.alpha = .35;
                this._background.interactive = true;
                this._errorPopuptable = new Core.Parts.Sprite(640, 344, Core.StyleInformation.Popup, this._popupContainer, "ErrorPopuptable");
                this._headerText = Core.Game.instance.language.createText(Core.LanguageNames.ErrorMessageHeader, 640, 283, null, Core.StyleInformation.ErrorMessageHeader, this._popupContainer);
                this._messageText = Core.Game.instance.language.createText(Core.LanguageNames.ErrorMessage, 640, 366, null, Core.StyleInformation.ErrorMessageText, this._popupContainer);
                this._button = new Core.Parts.BasicButton(640, 455, null, "", Core.StyleInformation.UI.GeneralButton, this._popupContainer, "GENERALBUTTON");
                this._buttonText = Core.Game.instance.language.createText(Core.LanguageNames.GeneralButton, 640, 455, null, Core.StyleInformation.GeneralButton, this._popupContainer);
            };
            PopupMV.prototype.setPopupButtonType = function (type) {
                switch (type) {
                    case PopupButtonType.Reload:
                        this._buttonText.text = Core.Game.instance.language.parse(Core.LanguageNames.ReloadButton);
                        this._button.Callback = this._popupController.reloadGame.bind(this._popupController);
                        break;
                    case PopupButtonType.ContinueGame:
                        this._buttonText.text = Core.Game.instance.language.parse(Core.LanguageNames.ContinueButton);
                        this._button.Callback = this._popupController.continueGame.bind(this._popupController);
                        break;
                    case PopupButtonType.Okay:
                        this._buttonText.text = Core.Game.instance.language.parse(Core.LanguageNames.OkButton);
                        this._button.Callback = this._popupController.closePopup.bind(this._popupController);
                        break;
                }
            };
            PopupMV.prototype.popupType = function (header, context, type) {
                this.tweenVisiblePopupContainer(true);
                this._headerText.text = header.toString();
                this._messageText.text = context;
                this.setPopupButtonType(type);
            };
            PopupMV.prototype.tweenVisiblePopupContainer = function (visible) {
                var _this = this;
                this._popupContainer.visible = true;
                if (visible) {
                    TweenLite.to(this._popupContainer, 0.5, { alpha: 1, ease: Sine.easeIn });
                }
                else {
                    TweenLite.to(this._popupContainer, 0.5, { alpha: 0, ease: Sine.easeIn, onComplete: function () { _this._popupContainer.visible = false; } });
                }
            };
            PopupMV.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            PopupMV.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._popupContainer.position.set(0, 0);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._popupContainer.position.set(-270, 289);
                        break;
                }
            };
            Object.defineProperty(PopupMV.prototype, "popupContainer", {
                get: function () {
                    return this._popupContainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PopupMV.prototype, "mainStage", {
                get: function () {
                    return this._stage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PopupMV.prototype, "popupController", {
                get: function () {
                    return this._popupController;
                },
                enumerable: true,
                configurable: true
            });
            return PopupMV;
        }());
        View.PopupMV = PopupMV;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var TurboController = Core.Controller.TurboController;
        var TurboView = (function () {
            function TurboView(stage) {
                this._stage = stage;
                this._turboController = new TurboController(this, stage);
                this.initProperties();
            }
            TurboView.prototype.initProperties = function () {
                this._container = new Core.Parts.Container(this._stage.backgroundView.baseContainer, "TurboContainer");
                this._turboButton = new Core.Parts.BasicButton(0, 0, this._turboController.turboButtonUp.bind(this._turboController), "", Core.StyleInformation.UI.TurboButtonOut, this._container, "TurboButton");
                var sideMask = new PIXI.Graphics();
                sideMask.beginFill(0xffffff, 1);
                sideMask.drawCircle(this._turboButton.position.x - 8, this._turboButton.position.y, 97);
                sideMask.endFill();
                this._container.addChild(sideMask);
                this._turboButton.mask = sideMask;
                this._turboText = Core.Game.instance.language.createText(Core.LanguageNames.TurboButton, 0, 25, null, Core.StyleInformation.TurboButtonOut, this._turboButton);
                this._buttonEffect = new Core.Parts.AnimatedSprite(0, -75, Core.Parts.AnimatedSprite.generateTextures(Core.StyleInformation.TurboButtonEffect, 19, 43, "", 5), false, 0.35, this._turboButton);
                this._buttonEffect.scale.set(.8, .8);
            };
            TurboView.prototype.playTurboButtonEffect = function () {
                this._buttonEffect.resetAnimation();
                this._buttonEffect.play();
            };
            TurboView.prototype.setButtonState = function (state) {
                switch (state) {
                    case Core.ButtonStateType.response:
                        this._turboButton.isEnabled = true;
                        break;
                    case Core.ButtonStateType.sendAction:
                        this._turboButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.turboDisabled:
                        this._turboButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.forward:
                        if (this._stage.bingoType == Core.BingoType.turbo)
                            this._turboButton.isEnabled = false;
                        else
                            this._turboButton.isEnabled = true;
                        break;
                    case Core.ButtonStateType.instant:
                        this._turboButton.isEnabled = false;
                        break;
                    case Core.ButtonStateType.updateData:
                        this._turboButton.isEnabled = true;
                        break;
                }
            };
            TurboView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        this._turboButton.setFrames(Core.StyleInformation.UI.TurboButtonOut);
                        this._turboText.style = new PIXI.TextStyle(Core.StyleInformation.TurboButtonOut);
                        break;
                    case Core.VisualType.turbo:
                        this._turboButton.setFrames(Core.StyleInformation.UI.TurboButtonOn);
                        this._turboText.style = new PIXI.TextStyle(Core.StyleInformation.TurboButtonOut);
                        break;
                    case Core.VisualType.forward:
                        if (this._stage.bingoType == Core.BingoType.turbo) {
                            this._turboButton.setFrames(Core.StyleInformation.UI.TurboButtonOn);
                            this._turboText.style = new PIXI.TextStyle(Core.StyleInformation.TurboButtonOut);
                        }
                        else {
                            this._turboButton.setFrames(Core.StyleInformation.UI.TurboButtonOut);
                            this._turboText.style = new PIXI.TextStyle(Core.StyleInformation.TurboButtonOut);
                        }
                        break;
                    case Core.VisualType.instant:
                        this._turboButton.setFrames(Core.StyleInformation.UI.TurboButtonOut);
                        this._turboText.style = new PIXI.TextStyle(Core.StyleInformation.TurboButtonDisabled);
                        break;
                }
            };
            TurboView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._container.position.set(805, 557);
                        this._container.scale.set(1, 1);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._container.position.set(141, 670);
                        this._container.scale.set(1.3, 1.3);
                        break;
                }
            };
            Object.defineProperty(TurboView.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TurboView.prototype, "controller", {
                get: function () {
                    return this._turboController;
                },
                enumerable: true,
                configurable: true
            });
            return TurboView;
        }());
        View.TurboView = TurboView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var View;
    (function (View) {
        var UIController = Core.Controller.UIController;
        var UIView = (function () {
            function UIView(stage) {
                this._menuBarButtons = {};
                this._stage = stage;
                this._uiController = new UIController(this, stage);
                this.initProperties();
            }
            UIView.prototype.initProperties = function () {
                this._container = new Core.Parts.Container(this._stage, "UIContainer");
                this._sideContainer = new Core.Parts.Container(this._container, "SideContainer");
                this._footerContainer = new Core.Parts.Container(this._container, "FooterContainer");
                this._dimGraphics = new PIXI.Graphics();
                this._dimGraphics.beginFill(0x000000, 1);
                this._dimGraphics.drawRect(0, 0, 1900, 300);
                this._dimGraphics.endFill();
                this._footerBackground = new Core.Parts.Sprite(640, 820, this._dimGraphics.generateCanvasTexture(), this._footerContainer, "FooterBackground");
                this._menuButton = new Core.Parts.BasicButton(191, 702, this._uiController.menuButtonUp.bind(this._uiController), "", Core.StyleInformation.UI.Menu, this._footerContainer, "MenuButton");
                this._menuButton.scale.set(.6, .6);
                this.createMenuButton();
                this._winText = Core.Game.instance.language.createText(Core.LanguageNames.Win, 0, 0, null, Core.StyleInformation.Win, this._footerContainer, Core.Anchor.center);
                this._winValue = Core.Game.instance.language.createText(Core.LanguageNames.WinValue, 0, 0, null, Core.StyleInformation.WinValue, this._footerContainer, Core.Anchor.center);
                this._modeText = Core.Game.instance.language.createText(Core.LanguageNames.ModeText, 0, 0, null, Core.StyleInformation.Mode, this._footerContainer);
                this._creditText = Core.Game.instance.language.createText(Core.LanguageNames.Balance, 0, 0, null, Core.StyleInformation.Balance, this._footerContainer, Core.Anchor.center);
                this._creditValue = Core.Game.instance.language.createText(Core.LanguageNames.BalanceValue, 0, 0, null, Core.StyleInformation.BalanceValue, this._footerContainer, Core.Anchor.center);
                this._creditValue.addChild(this._creditText);
                this.updateCreditValueText(Core.Controller.DataController.Instance.credit);
            };
            UIView.prototype.createMenuButton = function () {
                var iOS = false;
                try {
                    iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                }
                catch (e) { }
                if (Core.Game.instance.config.menubar.history)
                    this.addMenuButton("History");
                if (Core.Game.instance.config.menubar.help)
                    this.addMenuButton("Help");
                if (Core.Game.instance.config.menubar.home)
                    this.addMenuButton("Home");
                if (Core.Game.instance.config.menubar.volume)
                    this.addMenuButton("Sound");
                this.addMenuButton("FullScreen");
                this._menuBarButtons["FullScreen"].visible = !iOS;
            };
            UIView.prototype.addMenuButton = function (name) {
                var y = this._menuButton.position.y - (55 * (this._sideContainer.children.length + 1));
                var button;
                switch (name) {
                    case "History":
                        button = new Core.Parts.BasicButton(0, y, this._uiController.historyButtonUp.bind(this._uiController), "", Core.StyleInformation.UI.History, this._sideContainer, name);
                        break;
                    case "Help":
                        button = new Core.Parts.BasicButton(0, y, this._uiController.helpButtonUp.bind(this._uiController), "", Core.StyleInformation.UI.Help, this._sideContainer, name);
                        break;
                    case "Home":
                        button = new Core.Parts.BasicButton(0, y, this._uiController.homeButtonUp.bind(this._uiController), "", Core.StyleInformation.UI.Home, this._sideContainer, name);
                        break;
                    case "Sound":
                        button = new Core.Parts.BasicButton(0, y, this._uiController.soundButtonUp.bind(this._uiController), "", Core.StyleInformation.UI.SoundOn, this._footerContainer, name);
                        break;
                    case "FullScreen":
                        button = new Core.Parts.BasicButton(0, y, this._uiController.fullScreenButtonUp.bind(this._uiController), "", Core.StyleInformation.UI.FullScreen, this._footerContainer, name);
                        break;
                }
                this._menuBarButtons[name] = button;
                this._menuBarButtons[name].scale.set(.6, .6);
            };
            UIView.prototype.checkModeType = function () {
                var funText = Core.Game.instance.language.parse("ModeFun");
                var modeText = Core.Game.instance.language.parse("ModeText");
                Core.Game.instance.service.config.mode != "real" ? this._modeText.text = funText : this._modeText.text = modeText;
            };
            UIView.prototype.setButtonState = function (state) {
                switch (state) {
                    case Core.ButtonStateType.response:
                        this._menuBarButtons["History"].isEnabled = true;
                        break;
                    case Core.ButtonStateType.sendAction:
                        this._menuBarButtons["History"].isEnabled = false;
                        break;
                    case Core.ButtonStateType.forward:
                        this._menuBarButtons["History"].isEnabled = false;
                        break;
                    case Core.ButtonStateType.instant:
                        this._menuBarButtons["History"].isEnabled = false;
                        break;
                    case Core.ButtonStateType.updateData:
                        this._menuBarButtons["History"].isEnabled = true;
                        break;
                }
            };
            UIView.prototype.playMenuBarAnimation = function (open) {
                var y, tint;
                open ? y = 0 : y = (this._sideContainer.children.length + 1) * 60;
                TweenLite.to(this._sideContainer, 0.25, { y: y, ease: Back.easeOut.config(1, 1) });
            };
            UIView.prototype.changeSoundFrame = function (sound) {
                var soundTexture;
                sound ? soundTexture = Core.StyleInformation.UI.SoundOn : soundTexture = Core.StyleInformation.UI.SoundOff;
                this._menuBarButtons["Sound"].setFrames(soundTexture);
            };
            UIView.prototype.changeVisual = function (type) {
                switch (type) {
                    case Core.VisualType.normal:
                        break;
                    case Core.VisualType.turbo:
                        break;
                    case Core.VisualType.forward:
                        break;
                }
            };
            UIView.prototype.changeOrientation = function (orientation) {
                switch (orientation) {
                    case Core.DisplayOrientation.landscape:
                        this._container.position.set(0, 0);
                        this._menuButton.position.set(185 - Core.Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape), 698);
                        if (this._menuBarButtons["Sound"])
                            this._menuBarButtons["Sound"].position.set(240 - Core.Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape), 698);
                        if (this._menuBarButtons["FullScreen"])
                            this._menuBarButtons["FullScreen"].position.set(1094 + Core.Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape), 698);
                        this._winText.position.set(240 - Core.Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape) + this._winText.width / 2 + 30, 698);
                        this._winValue.position.set(this._winText.position.x + this._winText.width / 2 + 35, 698);
                        this._creditText.position.set(-this._creditText.width / 2 - this._creditValue.width / 2 - 5, 0);
                        this._creditValue.position.set(1094 + Core.Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape) - this._creditValue.width / 2 - 35, 698);
                        this._sideContainer.position.set(185 - Core.Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape), (this._sideContainer.children.length + 1) * 60);
                        this._modeText.visible = true;
                        this._modeText.position.set(640, 698);
                        break;
                    case Core.DisplayOrientation.portrait:
                        this._menuButton.position.set(24, 698);
                        if (this._menuBarButtons["FullScreen"])
                            this._menuBarButtons["FullScreen"].position.set(696, 698);
                        if (this._menuBarButtons["Sound"])
                            this._menuBarButtons["Sound"].position.set(this._menuButton.x + 55, 698);
                        this._winText.position.set(this._menuButton.x + 55 + this._winText.width / 2 + 30, 700);
                        this._winValue.position.set(this._winText.position.x + this._winText.width / 2 + 35, 698);
                        this._creditValue.position.set(696 - this._creditValue.width / 2 - 35, 698);
                        this._creditText.position.set(-this._creditText.width / 2 - this._creditValue.width / 2 - 5, 0);
                        this._sideContainer.position.set(24, (this._sideContainer.children.length + 1) * 60);
                        this._container.position.set(0, Core.Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionYForPortrait) - 80);
                        if (Core.Game.instance.service.config.mode == "real")
                            this._modeText.visible = false;
                        this._modeText.position.set(346, 698);
                        break;
                }
            };
            UIView.prototype.updateCreditValueText = function (val) {
                this._creditValue.text = Core.Controller.DataController.Instance.resolveFormat(val / 100);
                this._creditText.position.set(-this._creditText.width / 2 - this._creditValue.width / 2 - 5, 0);
                this._creditValue.position.set(this._menuBarButtons["FullScreen"].position.x - this._creditValue.width / 2 - 35, 698);
            };
            UIView.prototype.updateWinValue = function () {
                TweenLite.fromTo(this._winValue.scale, .35, { x: 1.2, y: 1.2 }, { x: 1, y: 1, yoyo: true, repeat: 3, repeatDelay: .2, ease: Bounce.easeIn });
                this._winValue.text = Core.Controller.DataController.Instance.resolveFormat((Core.Controller.DataController.Instance.earnCents / 100));
            };
            Object.defineProperty(UIView.prototype, "fullScreenButton", {
                get: function () {
                    return this._menuBarButtons["FullScreen"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIView.prototype, "winValueText", {
                get: function () {
                    return this._winValue.text;
                },
                set: function (val) {
                    this._winValue.text = val;
                    this._winValue.position.set(this._winText.position.x + this._winText.width / 2 + 35, 698);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIView.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            return UIView;
        }());
        View.UIView = UIView;
    })(View = Core.View || (Core.View = {}));
})(Core || (Core = {}));
//# sourceMappingURL=bundle.js.map