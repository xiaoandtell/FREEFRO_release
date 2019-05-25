// Main Character Components

module XG {
	export class MC_GravitySpike extends A_ {
		protected entity: MC;

		/** gravity spike cooldown and effect duration in milliseconds */
		static readonly DURATION_COOLDOWN: number = 777;
		private isGravitySpikeReady: boolean = true;

		protected constructThis(): void {
			Gm.ie.onInputDown.add(this.handleClick, this);
		}

		private handleClick(): void {
			if (!MrSettings.ie.getV(Ks.gravitySpike)) { return; }
			if (!this.isGravitySpikeReady) { return; }

			var gm: Gm = Gm.ie;
			gm.onGravitySpike.dispatch();

			var xyAfro: I_xy = this.entity.xyAfro,
				colorsAfro: number[] = this.entity.tierBonus.colors;
			new EffectGravitySpike(xyAfro.x, xyAfro.y, colorsAfro);

			gm.sound.play(Ks.gravitySpike);

			this.isGravitySpikeReady = false;
			var msCooldown: number = MC_GravitySpike.DURATION_COOLDOWN;
			gm.time.events.add(msCooldown, this.readyGravitySpike, this);
		}
		private readyGravitySpike(): void {
			this.isGravitySpikeReady = true;
		}
	}
	/** ensure arm bends correctly at elbow */
	export class MC_JointsFixHyperextension extends A_ {
		protected entity: MC;

		protected constructThis(): void {
			Gm.ie.onUpdate.add(this.fixElbowHyperextension, this);
		}

		private fixElbowHyperextension(): void {
			var mc: MC = this.entity;
			var gsLimbs: GsLimb[] = mc.gsLimbs,
				jsElbow: box2d.b2RevoluteJoint[] = [mc.jElbowF, mc.jElbowB];
			for (var i: number = 0; i < 2; i++) {
				var rotJElbow: number = jsElbow[i].GetJointAngleRadians();
				if (!(rotJElbow < -box2d.b2_pi || rotJElbow > box2d.b2_pi)) {
					continue;
				}

				// straighten humerus and ulna when hyperextension occurs
				var gsLimb: GsLimb = gsLimbs[i];
				var bHumerus: PBBody = gsLimb.gHumerus.body,
					bUlna: PBBody = gsLimb.gUlna.body;
				bHumerus.rotation = bUlna.rotation
					= (bHumerus.rotation + bUlna.rotation) / 2;
			}
		}
	}
	/**
	 * Box2D often does not always resolve 2 jointed bodies in time for render
	 * draw a lines between joint gaps when they occur
	 * so that limbs do not look separated
	 */
	export class MC_JointsStretch extends A_ {
		protected entity: MC;

		// graphics for drawing lines representing hyperextended joints
		private gsJointStretch: Graphic[];
		/**
		 * [graphic: Graphic, joint: box2d.b2Joint, width: number][]
		 * for joined MC graphics
		 */
		private gs_js_ws: any[][];

		protected constructThis(): void {
			this.constructThisGraphicsJointsStretch();
			this.constructThisJointsWidths();
			Gm.ie.onPreRender.add(this.preRender, this);
		}
		protected constructThisGraphicsJointsStretch(): void {
			var mrStage: MrStage = MrStage.ie,
				groupsJointsStretch: PGp[] = [
					mrStage.groupMCFront,
					mrStage.groupMCMiddle,
					mrStage.groupMCBack
				],
				gsJointStretch: Graphic[] = [];
			for (var group of groupsJointsStretch) {
				var gJS: Graphic = Gm.ie.add.graphics(0, 0, group);
				group.sendToBack(gJS);
				gsJointStretch.push(gJS);
			}
			this.gsJointStretch = gsJointStretch;
		}
		protected constructThisJointsWidths(): void {
			var mc: MC = this.entity;
			var gs: Graphic[] = this.gsJointStretch;
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
			]
		}

		private preRender(): void {
			// prepare graphics to draw joints
			var gsJointStretch: Graphic[] = this.gsJointStretch;
			for (var g of gsJointStretch) {
				g.clear();
			}

			// draw connections between overstretched joints
			var b2d: PB = Gm.ie.b2d;
			var color: number = Color.MC_SKIN;
			var gs_js_ws: any[][] = this.gs_js_ws;
			for (var g_j_w of gs_js_ws) {
				var g: Graphic = g_j_w[0],
					j: box2d.b2Joint = g_j_w[1],
					w: number = g_j_w[2];
				var jAnchorA: I_xy = j.GetAnchorA(new box2d.b2Vec2()),
					jAnchorB: I_xy = j.GetAnchorB(new box2d.b2Vec2());
				g.lineStyle(w, color);
				g.moveTo(b2d.mpx(-jAnchorA.x), b2d.mpx(-jAnchorA.y));
				g.lineTo(b2d.mpx(-jAnchorB.x), b2d.mpx(-jAnchorB.y));
			}
		}
	}
	export class MC_Jump extends A_ {
		protected entity: MC;

		static get DyJumpThreshold(): number { return -Gm.ie.height / 2; }

		/**
		 * @example 'jump_ready': can jump
		 * @example 'jump_started': can jump - check before continuing
		 * @example 'jump_stopped': can't jump
		 */
		state: string = Ks.jump_stopped;

		private get bsToJump(): PBBody[] {
			var mc: MC = this.entity;
			return [
				mc.locomotor.bMotor,
				mc.locomotor.bSeat,
				mc.gHip.body,
				mc.gGut.body,
				mc.gChest.body,
				mc.gHead.body
			];
		}
		private get maxY(): number {
			var result: number = Hoop.Y / 4;
			// MC can jump higher as score increases
			result -= MrVsGm.ie.vScore;
			return result;
		}

		protected constructThis(): void {
			this.entity.onBeginContact.add(this.handleBeginContact, this);
			this.entity.onUpdate.add(this.update, this);
		}

		private handleBeginContact(fThis: BF, _fThat: BF): void {
			var kThis: string = fThis[Ks.k];
			if (kThis === Ks.fLomoStep || kThis === Ks.fFoot) {
				this.jumpReady();
			}
		}

		/** ready to jump again after landing */
		private jumpReady(): void {
			this.setGravityScale(GmPhysics.GRAVITYSCALE_x1);

			this.state = Ks.jump_ready;
		}
		private jumpStart(): void {
			this.setGravityScale(GmPhysics.GRAVITYSCALE_x1);

			this.jumpUpdate();

			this.state = Ks.jump_started;
		}
		private jumpStop(): void {
			// Mario-style post-jump drop
			this.setGravityScale(GmPhysics.GRAVITYSCALE_DROP);

			this.state = Ks.jump_stopped;
		}
		private jumpUpdate(): void {
			var bs: PBBody[] = this.bsToJump,
				bLomo: PBBody = bs[0];
			// calculate projected jump limit, given current velocity
			var ay: number = Gm.ie.b2d.gravity.y;
			var vyBLomo: number = bLomo.velocity.y;
			var yJump: number = bLomo.y - (vyBLomo * vyBLomo) / (2 * ay);
			var isFinishedJump: boolean =
				yJump <= this.maxY // can't jump above max height
				|| vyBLomo >= 0 // can't jump when falling;
			if (isFinishedJump) {
				this.jumpStop();
				return;
			}

			// continue jumping as input is rising
			var dyJump: number = MrInput.ie.dyPerSecond;
			if (dyJump >= 0) { return; }

			// limit jump speed
			dyJump = Math.max(-128, dyJump);
			for (var b of bs) {
				b.velocity.y += dyJump;
			}
		}

		private setGravityScale(value: number): void {
			var bs: PBBody[] = this.bsToJump;
			for (var b of bs) {
				b.gravityScale = value;
			}
		}

		private update(): void {
			switch (this.state) {
				case Ks.jump_ready:
					var dyPerSecond: number = MrInput.ie.dyPerSecond;
					if (dyPerSecond < MC_Jump.DyJumpThreshold) {
						this.jumpStart();
					}
					break;
				case Ks.jump_started:
					this.jumpUpdate();
					break;
				case Ks.jump_stopped:
				default:
					break;
			}
		}
	}
	/** invisible unicycle that drives character */
	export class MC_Locomotor extends A_ {
		protected entity: MC;

		private static readonly DxToMove: number = 64;

		bSeat: PBBody;
		bMotor: PBBody;
		jSeat: box2d.b2PrismaticJoint;
		jMotor: box2d.b2WheelJoint;
		// construct variables
		get dyMotor(): number { return this.rMotor + MCConstruct.dyLegHip; }
		get rMotor(): number { return MCConstruct.lLegFoot / 2; }
		get rpsMotor(): number { return 1; }

		protected constructThis(): void {
			this.constructThisBodies();
			this.constructThisJoints();
			this.entity.onUpdate.add(this.update, this);
		}
		private constructThisBodies(): void {
			var gm: Gm = Gm.ie;
			var rMotor: number = this.rMotor,
				x: number = this.entity.gHip.x,
				y: number = this.entity.gHip.y;

			// seat:
			var bSeat: PBBody = new Phaser.Physics.Box2D.Body(gm, null, x, y);
			bSeat.fixedRotation = true;
			bSeat.setCircle(MCConstruct.u / 2);
			this.bSeat = bSeat;

			// motor:
			var bMotor: PBBody = new Phaser.Physics.Box2D.Body(gm, null, x, y);
			bMotor.setCircle(rMotor);
			// motor: step sensor for each foot
			var numSS: number = 2,
				radiusSS: number = 4;
			for (var i: number = 0; i < numSS; i++) {
				var rotationSS: number = box2d.b2_two_pi * i / numSS,
					xSS: number = rMotor * Math.cos(rotationSS),
					ySS: number = rMotor * Math.sin(rotationSS);
				var fSS: BF = bMotor.addCircle(radiusSS, xSS, ySS);
				fSS.SetSensor(true);
				fSS.SetUserData(this);
				fSS[Ks.k] = Ks.fLomoStep;
			}
			bMotor.friction = 4;
			bMotor.mass *= 8;
			this.bMotor = bMotor;

			// set collision
			for (var b of [bSeat, bMotor]) {
				b.setCollisionCategory(Collision.MC);
				b.setCollisionMask(Collision.GROUND);
			}
		}
		private constructThisJoints(): void {
			var gmB2D: PB = Gm.ie.b2d;
			this.jSeat = gmB2D.prismaticJoint(this.bSeat, this.entity.gHip.body,
				0, 1, 0, 0, 0, 0, -32, 32, true, 0, 100, true);
			this.jMotor = gmB2D.wheelJoint(this.bSeat, this.bMotor,
				0, this.dyMotor, 0, 0, 0, 1, 7, 0.5, 0, 7777, true);
		}

		handleBeginContact(fThis: BF, fThat: BF): void {
			var kThis: string = fThis[Ks.k];
			if (kThis === Ks.fLomoStep) {
				this.entity.onBeginContact.dispatch(fThis, fThat);
			}
		}

		private update(): void {
			var dxToMove: number = MC_Locomotor.DxToMove,
				dx: number = Gm.ie.input.x - this.bMotor.x;
			if (Math.abs(dx) < dxToMove) {
				// stop moving when input is close to MC
				this.jMotor.SetMotorSpeed(0);
				return;
			}
			if (dx < 0) {
				// move left
				this.jMotor.SetMotorSpeed(-2 * Math.PI * this.rpsMotor);
			} else {
				// move right
				this.jMotor.SetMotorSpeed(2 * Math.PI * this.rpsMotor);
			}
		}
	}
	/**
	 * MC has pupils in eyes;
	 * when ready to throw ball, pupils dilate and track hoop;
	 * otherwise, pupils track player input
	 */
	export class MC_Pupils extends A_ {
		protected entity: MC;

		private gPupilF: Graphic;
		private gPupilB: Graphic;
		// pupil dilation tweens
		private twScalePupilF: PTw;
		private twScalePupilB: PTw;

		protected constructThis(): void {
			this.constructThisGraphics();
			this.constructThisListenSignals();
		}
		private constructThisGraphics(): void {
			var gHead: GSprite = this.entity.gHead;
			for (var i: number = 0; i < 2; i++) {
				var gPupil: Graphic = Gm.ie.add.graphics(0, 0,
					MrStage.ie.groupMCMiddle);

				var isFront = i == 1;
				if (isFront) {
					this.gPupilF = gPupil;
				} else {
					this.gPupilB = gPupil;
				}
				var scale: number = (isFront) ? 1 : 0.75;

				gPupil.beginFill(Color.BLACK);
				gPupil.drawCircle(0, 0, 10 * scale);
				// specular highlights
				gPupil.beginFill(Color.WHITE);
				gPupil.drawCircle(2 * scale, -2 * scale, 4 * scale);
				gPupil.drawCircle(-2 * scale, -2 * scale, 2 * scale);
				gHead.addChild(gPupil);

			}
		}
		private constructThisListenSignals(): void {
			var onStateChangeMCBall: PSg = this.entity.updateBall.onStateChange;
			onStateChangeMCBall.add(this.setSizePupilByStateMCBall, this);
			Gm.ie.onPreRender.add(this.setPositionPupil, this);
		}

		private setPositionPupil(): void {
			var stateBall: string = this.entity.updateBall.state;
			var target: I_xy = (stateBall === Ks.ball_throwReady)
				? MrStage.ie.hoop.g // look at hoop when ready to throw
				: MrInput.ie;
			var dyCenterHead: number = -MCConstruct.rHead;
			var gHead: GSprite = this.entity.gHead;
			var gsPupils: Graphic[] = [this.gPupilB, this.gPupilF];
			for (var i: number = 0; i < gsPupils.length; i++) {
				var gPupil: Graphic = gsPupils[i];
				var isFront = i == 1;
				// position of eye relative to head
				var xyEye: PIXI.Point = (isFront)
					? new PIXI.Point(-5.5, dyCenterHead - 3.5)
					: new PIXI.Point(27, dyCenterHead - 5);
				var xyTarget: I_xy = gHead.toLocal(new PIXI.Point(
					target.x, target.y
				), null);
				// direction from eye to target
				var dE2T: Phaser.Point = new Phaser.Point(
					xyTarget.x, xyTarget.y
				);
				// do not move pupil beyond eye boundaries
				var dPupil: number = 2;
				dE2T.setMagnitude(Math.min(dPupil, dE2T.getMagnitude()));

				var dxPupil: number = xyEye.x + dE2T.x,
					dyPupil: number = xyEye.y + dE2T.y;
				gPupil.x = dxPupil;
				gPupil.y = dyPupil;
			}
		}

		private setSizePupilByStateMCBall(state: string): void {
			var scalePupilF: I_xy = this.gPupilF.scale;
			var scalePupilB: I_xy = this.gPupilB.scale;
			if (state == Ks.ball_throwReady) {
				scalePupilF.x = scalePupilF.y =
					scalePupilB.x = scalePupilB.y = Consts.PHI;
				this.setSizePupilTween(true);
			} else {
				this.setSizePupilTween(false);
				scalePupilF.x = scalePupilF.y =
					scalePupilB.x = scalePupilB.y = 1;
			}
		}
		private setSizePupilTween(isDilating: boolean): void {
			if (!isDilating) {
				if (this.twScalePupilF) {
					this.twScalePupilF.stop();
					this.twScalePupilB.stop();
				}
				return;
			}

			// after initial dilation, pupils contract to final scale
			var propertiesTw: I_xy = { x: 1.25, y: 1.25 }, // final scale
				dur: number = 500,
				ease: Function = Phaser.Easing.Quadratic.Out;
			var gsPupils: Graphic[] = [this.gPupilF, this.gPupilB]
			for (var gPupil of gsPupils) {
				var twScalePupil: PTw = Gm.ie.add.tween(this.gPupilF.scale);
				twScalePupil.to(propertiesTw, dur, ease);
				twScalePupil.start();
				if (gPupil == this.gPupilF) {
					this.twScalePupilF = twScalePupil;
				} else {
					this.twScalePupilB = twScalePupil;
				}
			}
		}
	}
	export class MC_Sounds extends A_ {
		protected entity: MC;

		protected constructThis(): void {
			this.entity.onBeginContact.add(this.handleBeginContact, this);
		}

		handleBeginContact(fThis: BF, fThat: BF): void {
			if (fThat.IsSensor()) { return; }

			var kThis: string = fThis[Ks.k];
			if (kThis === Ks.fAfro) {
				// emit no sound when held ball passes afro
				var ballThis: Ball = this.entity.updateBall.ball;
				if (ballThis && ballThis == fThat.GetUserData()) {
					return;
				}

				Gm.ie.sound.play(Ks.afroHit);
				return;
			}

			var categThat: number = fThat.GetFilterData().categoryBits;
			if (kThis === Ks.fFoot) {
				if (!(categThat & Collision.GROUND)) { return; }

				Gm.ie.sound.play(Ks.footStep);
			} else if (kThis === Ks.fHand) {
				if (
					!(categThat & Collision.BALL) ||
					this.entity.updateBall.isTouchingBall
				) { return; }

				Gm.ie.sound.play(Ks.ballHit);
			}
		}
	}
	/** change afro to represent highest tier reached in current game session */
	export class MC_UpdateAfro extends A_ {
		protected entity: MC;

		protected constructThis(): void {
			MrVsGm.ie.onTierChange.add(this.updateAfro, this);
			Gm.ie.time.events.add(1000, this.updateGlitter, this);
		}

		/** update afro graphic and glitter count */
		private updateAfro(iTier: number): void {
			var tierCurrent: TierBonus = MrTierBonus.Tiers[iTier];
			var mc: MC = this.entity;
			mc.tierBonus = tierCurrent;
			mc.gHead.loadTexture(tierCurrent.kGHead);

			Gm.ie.sound.play(tierCurrent.kSound);
		}
		private updateGlitter(): void {
			var gm: Gm = Gm.ie;
			var numGlitters: number = this.entity.tierBonus.value;
			if (numGlitters <= 0) {
				// check again next second to see if afro has upgraded
				gm.time.events.add(1000, this.updateGlitter, this);
				return;
			}

			var mc: MC = this.entity,
				mcc: typeof MCConstruct = MCConstruct;
			var rAfro: number = mcc.rAfro,
				xyAfro: I_xy = mc.xyAfro,
				xAfro: number = xyAfro.x,
				yAfro: number = xyAfro.y;
			var rHead: number = mcc.rHead;
			var xyCenterHead: PIXI.Point = new PIXI.Point(0, -mcc.rHead);
			xyCenterHead = gm.stage.toLocal(xyCenterHead, mc.gHead);
			var xCenterHead: number = xyCenterHead.x,
				yCenterHead: number = xyCenterHead.y;
			for (var i: number = 0; i < numGlitters; i++) {
				// position of glitter falls within afro's radius
				var rotation: number = gm.rnd.realInRange(0, box2d.b2_two_pi),
					magnitude: number = rAfro * Math.random(),
					offsetX: number = magnitude * Math.cos(rotation),
					xGlitter: number = xAfro + offsetX,
					offsetY: number = magnitude * Math.sin(rotation),
					yGlitter: number = yAfro + offsetY;

				// glitter on afro only; prevent glitter on face
				var dGlitter2Head: number = Phaser.Math.distance(
					xGlitter, yGlitter, xCenterHead, yCenterHead);
				if (dGlitter2Head < rHead) { continue; }

				new EffectAfroGlitter(xGlitter, yGlitter);
			}

			var delayNextGlitter: number = gm.rnd.realInRange(100, 1000);
			gm.time.events.add(delayNextGlitter, this.updateGlitter, this);
		}
	}
	export class MC_UpdateBall extends A_ {
		protected entity: MC;

		/** keep track of grabbed ball */
		ball: Ball;
		/** joints to represent holding ball */
		private jsHand2Ball: box2d.b2Joint[] = [];

		/**
		 * @example null: ball not in hands
		 * @example 'ball': ball just contacted hand
		 * @example 'ball_unready': ball not ready to throw
		 * @example 'ball_ready': ball ready to throw
		 * @example 'ball_throwing': ball being thrown
		 */
		get state(): string { return this._state; }
		set state(v: string) {
			this._state = v;
			this.onStateChange.dispatch(v);
		}
		private _state: string;

		/** dispatch(v: string) */
		get onStateChange(): PSg { return this._onStateChange; }
		private _onStateChange: PSg = new Phaser.Signal();

		get isTouchingBall(): boolean { return this.state != null; }
		get target(): I_xy & I_xyPrev { return MrInput.ie; }

		private numVs: number = 4;
		private vsX: number[];
		private vsY: number[];

		protected constructThis(): void {
			this.entity.onBeginContact.add(this.handleBeginContact, this);
			this.entity.onUpdate.add(this.updateBall, this);
		}

		private handleBeginContact(fThis: BF, fThat: BF): void {
			var categThat: number = fThat.GetFilterData().categoryBits;
			if (categThat == Collision.BALL && fThis[Ks.k] === Ks.fHand) {
				var ball: Ball = fThat.GetUserData();
				this.handleBeginContactBall(ball);
				return;
			}

			var categThis: number = fThis.GetFilterData().categoryBits;
			if (categThat == Collision.HOOP && categThis & Collision.MC_LIMB) {
				this.handleBeginContactHoop();
			}
		}
		/** handle hand-to-ball contact */
		private handleBeginContactBall(ball: Ball): void {
			if (!this.isTouchingBall && ball.isTouchable) {
				this.ball = ball;
			}
		}
		/** handle hoop contact for slam dunk */
		private handleBeginContactHoop(): void {
			if (this.isTouchingBall) {
				this.state = Ks.ball_release;
			}
		}
		/** handle when ball is forced out of hand */
		private handleForceReleaseBall(): void {
			if (this.isTouchingBall) {
				this.state = Ks.ball_release;
			}
		}

		private set canTouchOtherBalls(v: boolean) {
			var gsLimbs: GsLimb[] = this.entity.gsLimbs;
			for (var gsLimb of gsLimbs) {
				var bHand: PBBody = gsLimb.gHand.body;
				bHand.sensor = !v;
			}
		}

		private updateBall(): void {
			if (!this.isTouchingBall) {
				if (this.ball != null) {
					// ball just grabbed; attach to hands
					this.updateBallGrab();
				} else {
					return;
				}
			}

			// ball is in hands

			var stateBall = this.state;
			if (stateBall === Ks.ball_release) {
				this.updateBallRelease();
			} else if (stateBall === Ks.ball_throwReady) {
				this.updateBallTrackVelocity();
				this.updateBallTryThrow();
				return;
			} else {
				this.updateBallSetThrowReady();
			}
		}
		private updateBallGrab(): void {
			var ball: Ball = this.ball;
			ball.isHeld = true;
			ball.onForce.addOnce(this.handleForceReleaseBall, this);
			Gm.ie.onBallGrabbed.dispatch();

			// add joints from hands to ball to hold ball
			var bBall: PBBody = ball.g.body;
			var jsHand2Ball: box2d.b2Joint[] = this.jsHand2Ball;
			var rHand: number = MCConstruct.rHand;
			for (var gsLimb of this.entity.gsLimbs) {
				var bHand: PBBody = gsLimb.gHand.body;
				var jHand2Ball: box2d.b2Joint = (jsHand2Ball.length == 0)
					// different joint types prevent joint solve conflicts
					? Gm.ie.b2d.weldJoint(bHand, bBall, rHand, 0, 0, 0, 1, 1)
					: Gm.ie.b2d.ropeJoint(bHand, bBall, rHand, rHand);
				jsHand2Ball.push(jHand2Ball);
			}

			// prevent ball from spinning excessively in hands as
			// weld joint forces connected bodies to rotate back to 0
			bBall.angularVelocity = 0;
			bBall.rotation %= box2d.b2_two_pi;
			var gsLimbFront: GsLimb = this.entity.gsLimbFront;
			for (var k in gsLimbFront) {
				var bLimb: PBBody = gsLimbFront[k].body;
				bLimb.rotation %= box2d.b2_two_pi;
			}

			this.state = Ks.ball_throwUnready;
			this.canTouchOtherBalls = false;
			this.vsX = [];
			this.vsY = [];
		}
		private updateBallRelease(): void {
			var ball: Ball = this.ball;
			ball.onForce.remove(this.handleForceReleaseBall, this);
			ball.isHeld = false;

			// stop holding onto ball by destroying hand-ball joints
			for (var j of this.jsHand2Ball) {
				Gm.ie.b2d.world.DestroyJoint(j);
			}
			this.jsHand2Ball = [];

			this.ball = null;
			this.state = null;
			this.canTouchOtherBalls = true;
		}
		private updateBallSetThrowReady(): void {
			var target: I_xy = this.target;
			/** throwing arm */
			var bArm: PBBody = this.entity.gsLimbFront.gHumerus.body;
			// distance from shoulder to input
			var distShoulder2Target: number = Phaser.Math.distance(
				bArm.x, bArm.y, target.x, target.y
			);
			this.state = (distShoulder2Target < MCConstruct.lArmHand)
				? Ks.ball_throwReady
				: Ks.ball_throwUnready;
		}
		private updateBallTryThrow(): void {
			var target: I_xy & I_xyPrev = this.target;
			var gsLimb: GsLimb = this.entity.gsLimbFront;
			/** throwing arm */
			var bArm: PBBody = gsLimb.gHumerus.body,
				lArm: number = MCConstruct.lArmHand;

			// ensure arm extended into throw
			/** distance from shoulder to input */
			var distShoulder2Target: number = Phaser.Math.distance(
				bArm.x, bArm.y, target.x, target.y
			);
			if (distShoulder2Target < lArm) { return; }

			// prevent accidental release when aiming away from hoop
			//
			// NOTE: this prevents player from throwing ball downward
			// if player is holding ball below hoop level
			var bChest: PBBody = this.entity.gChest.body,
				isAimingAway: boolean = this.ball.g.body.y > Hoop.Y
					&& (target.y > bChest.y || target.y > target.yPrev);
			if (isAimingAway) {
				this.state = Ks.ball_throwUnready;
				this.vsX = [];
				this.vsY = [];
				return;
			}

			// ensure throw occurs during arm extension phase
			var bHand: PBBody = gsLimb.gHand.body;
			// distance from shoulder to hand
			var distShoulder2Hand: number = Phaser.Math.distance(
				bArm.x, bArm.y, bHand.x, bHand.y
			);
			// distance from shoulder past which determines throw
			var distShoulder2Throw: number = lArm / Consts.PHI;
			if (distShoulder2Hand > distShoulder2Throw) {
				this.updateBallThrow();
			}
		}
		private updateBallThrow(): void {
			// calculate throw velocity as average of recent hand velocities
			var vsX: number[] = this.vsX,
				vX: number = 0,
				vsY: number[] = this.vsY,
				vY: number = 0;
			for (var i: number = 0; i < vsX.length; i++) {
				vX += vsX[i];
				vY += vsY[i];
			}
			// throw velocity leverages input velocity
			var target: I_xy & I_xyPrev = this.target;
			vX += target.x - target.xPrev;
			vY += target.y - target.yPrev;
			// throw velocity is smoothed using average
			var numVs: number = vsX.length + 1;
			vX /= numVs;
			vY /= numVs;

			// set ball velocity
			var vBall: I_xy = this.ball.g.body.velocity;
			vBall.x = vX;
			vBall.y = vY;

			this.updateBallRelease();
		}
		private updateBallTrackVelocity(): void {
			var vHandFront: I_xy = this.entity.gsLimbFront.gHand.body.velocity,
				vsX: number[] = this.vsX,
				vsY: number[] = this.vsY;
			vsX.push(vHandFront.x);
			vsY.push(vHandFront.y);
			// only track specified number of velocities
			var numVs: number = this.numVs;
			if (vsX.length > numVs) {
				this.vsX = vsX.slice(vsX.length - numVs, vsX.length);
				this.vsY = vsY.slice(vsY.length - numVs, vsY.length);
			}
		}
	}
	export class MC_UpdateBodies extends A_ {
		protected entity: MC;

		private isTrackingArm: boolean = true;

		protected constructThis(): void {
			this.entity.onBeginContact.add(this.handleBeginContact, this);
			this.entity.onUpdate.add(this.updateLimbs, this);
		}

		private handleBeginContact(_fThis: BF, fThat: BF): void {
			var categThat: number = fThat.GetFilterData().categoryBits;
			if (categThat == Collision.HOOP && !fThat.IsSensor()) {
				this.handleBeginContactHoop();
			}
		}
		private handleBeginContactHoop(): void {
			// upon touching hoop's rim, temporarily let arms go limp
			// to prevent clipping through rim at elbow, wrist joints
			this.isTrackingArm = false;
			Gm.ie.time.events.add(777, this.resetIsTrackingArm, this);
		}
		private resetIsTrackingArm(): void {
			this.isTrackingArm = true;
		}

		private updateLimbs(): void {
			this.updateTorso();
			this.updateArms();
		}
		/** pull head to look up or down, depending on y of input */
		private updateTorso(): void {
			var mc: MC = this.entity;
			var bHead: PBBody = mc.gHead.body,
				bs: PBBody[] = [bHead, mc.gChest.body, mc.gGut.body];
			var target: I_xy = Gm.ie.input;
			// prevent MC from bending backwards
			var xHip: number = mc.gHip.body.x;
			for (var b of bs) {
				// look up or down based on input y relative to body
				var dy: number = target.y - b.y,
					fy: number = Phaser.Math.clamp(dy, -b.mass, b.mass);
				// correct excessive bending over
				var isBendingBack: boolean = b.angularVelocity < 0,
					isBentBack: boolean = b.x < xHip,
					isOverBending: boolean = isBendingBack == isBentBack;
				if (isOverBending) {
					b.angularVelocity *= 0.75;
					fy = -Math.abs(fy);
				}
				b.applyForce(0, fy);
			}
		}
		/** pull arms toward input position */
		private updateArms(): void {
			if (!this.isTrackingArm) { return; }

			var lArm: number = MCConstruct.lArmHand;
			// give arms a slight lag when tracking
			var scaleV: number = Gm.ie.time.fps * 0.39;
			// where to extend hands
			var to: I_xy = Gm.ie.input;

			for (var gsLimb of this.entity.gsLimbs) {
				var bArm: PBBody = gsLimb.gHumerus.body,
					bHand: PBBody = gsLimb.gHand.body;
				// direction from shoulder to input
				var dA2I: Phaser.Point = new Phaser.Point(
					to.x - bArm.x,
					to.y - bArm.y
				);
				// do not extend arm beyond arm length
				dA2I.setMagnitude(Math.min(lArm, dA2I.getMagnitude()));
				// direction of hand to movement
				var dxH: number = bArm.x + dA2I.x - bHand.x,
					dyH: number = bArm.y + dA2I.y - bHand.y;
				bHand.velocity.x = dxH * scaleV;
				bHand.velocity.y = dyH * scaleV;
			}
		}
	}
	export class MC_WalkCycle extends A_ {
		protected entity: MC;

		private iStep: number = 0;
		private get dxStep(): number {
			return Math.PI * this.entity.locomotor.rMotor;
		}

		protected constructThis(): void {
			this.entity.onBeginContact.add(this.handleBeginContact, this);
			this.entity.onEndContact.add(this.handleEndContact, this);
		}

		private handleBeginContact(fThis: BF, _fThat: BF): void {
			if (fThis[Ks.k] === Ks.fLomoStep) {
				this.handleBeginContactStepLomo();
			}
		}
		private handleBeginContactStepLomo(): void {
			var mc: MC = this.entity;
			var lomo: MC_Locomotor = mc.locomotor,
				bLomo: PBBody = lomo.bMotor,
				rLomo: number = MCConstruct.hlLeg;
			var signDx: number = (lomo.jMotor.m_motorSpeed > 0) ? 1 : -1,
				dxStep: number = signDx * this.dxStep;

			// set leg going up
			var iU: number = this.iStep;
			var gsLegU = mc.gsLimbs[iU],
				bFemurU: PBBody = gsLegU.gFemur.body,
				bTibiaU: PBBody = gsLegU.gTibia.body,
				bFootU: PBBody = gsLegU.gFoot.body;

			if (signDx > 0) { // forward
				this.setVToRotation(bFemurU, -Math.PI / 3);
				this.setVToRotation(bTibiaU, 0);
			} else {
				this.setVToRotation(bFemurU, 0);
				this.setVToRotation(bTibiaU, Math.PI / 4);
			}

			this.setVToX(bFootU, bFemurU.x + dxStep);
			this.setVToY(bFootU, bLomo.y + bLomo.velocity.y);


			// set leg going down
			var iD: number = (iU + 1) % 2;
			var gsLegD = mc.gsLimbs[iD],
				bFemurD: PBBody = gsLegD.gFemur.body,
				bTibiaD: PBBody = gsLegD.gTibia.body,
				bFootD: PBBody = gsLegD.gFoot.body;

			this.setVToRotation(bTibiaD, 0);

			this.setVToRotation(bFootD, 0);
			this.setVToX(bFootD, bFemurD.x);
			this.setVToY(bFootD, bLomo.y + rLomo + bLomo.velocity.y);


			this.iStep = iD;


			if (Gm.isDebugging) {
				gsLegU.gFemur.tint = gsLegU.gFoot.tint = Color.GREEN;
				gsLegD.gFemur.tint = gsLegD.gFoot.tint = Color.RED;
			}
		}
		private handleEndContact(fThis: BF, _fThat: BF): void {
			if (fThis[Ks.k] === Ks.fFoot) {
				this.handleEndContactStepFoot();
			}
		}
		private handleEndContactStepFoot(): void {
			var mc: MC = this.entity;
			var bs: PBBody[] = [
				mc.gHead.body, mc.gChest.body, mc.gGut.body, mc.locomotor.bSeat
			];
			for (var b of bs) {
				// var forceStep: number = -16 * b.mass;
				// b.applyForce(0, forceStep);
				b.velocity.y -= 69;
			}
		}

		/** TODO: learn why this appears to mostly work */
		getScaleV(): number {
			var lomo: MC_Locomotor = this.entity.locomotor,
				speedLomoR: number = lomo.jMotor.m_motorSpeed,
				speedLomoRAbs: number = Math.abs(speedLomoR);
			return speedLomoRAbs;
		}
		getScaleVR(): number {
//			return this.entity.locomotor.rpsMotor;
			return this.getScaleV();
		}

		setVToRotation(b: PBBody, rotationTo: number, _time: number = 1): void {
			var dRotation: number = rotationTo - b.rotation;
			var vRotation: number = this.getScaleVR() * dRotation;
			b.angularVelocity = vRotation;
		}
		setVToX(b: PBBody, xTo: number, _time: number = 1): void {
			var dX: number = xTo - b.x;
			var vX: number = this.getScaleV() * dX;
			b.velocity.x = vX;
		}
		setVToY(b: PBBody, yTo: number, _time: number = 1): void {
			var dY: number = yTo - b.y;
			var vY: number = this.getScaleV() * dY;
			b.velocity.y = vY;
		}
	}
}
