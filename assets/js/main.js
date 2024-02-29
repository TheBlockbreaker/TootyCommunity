(function($) {

	var	$window = $(window),
		$body = $('body'),
		$main = $('#main');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav = $('#nav');

		if ($nav.length > 0) {

			// Shrink effect.
				$main
					.scrollex({
						mode: 'top',
						enter: function() {
							$nav.addClass('alt');
						},
						leave: function() {
							$nav.removeClass('alt');
						},
					});

			// Links.
				var $nav_a = $nav.find('a');

				$nav_a
					.scrolly({
						speed: 1000,
						offset: function() { return $nav.height(); }
					})
					.on('click', function() {

						var $this = $(this);

						// External link? Bail.
							if ($this.attr('href').charAt(0) != '#')
								return;

						// Deactivate all links.
							$nav_a
								.removeClass('active')
								.removeClass('active-locked');

						// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
							$this
								.addClass('active')
								.addClass('active-locked');

					})
					.each(function() {

						var	$this = $(this),
							id = $this.attr('href'),
							$section = $(id);

						// No section for this link? Bail.
							if ($section.length < 1)
								return;

						// Scrollex.
							$section.scrollex({
								mode: 'middle',
								initialize: function() {

									// Deactivate section.
										if (browser.canUse('transition'))
											$section.addClass('inactive');

								},
								enter: function() {

									// Activate section.
										$section.removeClass('inactive');

									// No locked links? Deactivate all links and activate this section's one.
										if ($nav_a.filter('.active-locked').length == 0) {

											$nav_a.removeClass('active');
											$this.addClass('active');

										}

									// Otherwise, if this section's link is the one that's locked, unlock it.
										else if ($this.hasClass('active-locked'))
											$this.removeClass('active-locked');

								}
							});

					});

		}

		// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000
		});

		// Flickity.
		if ($('.main-carousel').flickity) {
			$('.main-carousel').flickity({
				cellAlign: 'left',
				contain: true,
				fullscreen: true, 
				lazyLoad: 1
			});
		}

		let btn = $('#back-to-top');

		$(window).scroll(function() {
		  if ($(window).scrollTop() > 300) {
			btn.addClass('show');
		  } else {
			btn.removeClass('show');
		  }
		});
		
		btn.on('click', function(e) {
		  e.preventDefault();
		  $('html, body').animate({scrollTop:0}, '300');
		});
		
		particlesJS.load('particles-js', '/roblox/assets/particles.json');

		//motionPointerInit();

		/*
			import { gsap, Power3 } from "gsap"
			import Experience from "../Experience"
			import EventEmitter from "../Utils/EventEmitter"

			export default class HoverIcon extends EventEmitter {

				domElements = {
					icon: document.getElementById('hover-icon'),
					content: document.getElementById('hover-content'),
					colorSwitchContainer: document.getElementById('hover-icon-color-switch'),
					aboutSection: document.getElementById('about-section')
				}


				currentBaseColor = '#FF923E'
				cursorIsInsideDoc = true

				constructor() {
					super()

					this.experience = new Experience()
					this.sizes = this.experience.sizes
					this.scroll = this.experience.ui.scroll
					this.landingPage = this.experience.ui.landingPage
					this.intro = this.experience.ui.intro

					this.setupDefault()
					this.setCursorLeavesDoc()
					this.setHoverColorSwitchHeight()
					this.applyEventListeners()
					this.applyColorSwitchEventListeners()

					//Visbility on touch devices
					this.sizes.touch ? this.domElements.icon.classList.add('hide') : this.domElements.icon.classList.remove('hide')
					this.sizes.on('touch', () => this.domElements.icon.classList.add('hide'))
					this.sizes.on('no-touch', () => this.domElements.icon.classList.remove('hide'))

					document.addEventListener('visibilitychange', () => {
						this.updateBaseColor('#FF923E', true)
						console.log()
					})
				}

				// Apply Mouseenter, mouseleave and mousemove event listeners
				applyEventListeners() {
					this.hoverElements.forEach((element) => {
						const domElements = document.querySelectorAll(element.class)

						for (let i = 0; i < domElements.length; i++) {
							const domElement = domElements[i]

							// Mouseeenter 
							domElement.addEventListener('mouseenter', () => {
								if (!this.sizes.touch)
									element.type == 'pointer' ? this.setupPointer(element, domElement) : this.setupCircle(element, domElement)

								this.isHoveringCursorElement = true
							})

							// mouseleave 
							domElement.addEventListener('mouseleave', () => {
								if (!this.sizes.touch) {
									this.setupDefault()
									this.isHoveringCursorElement = false
								}
							})
						}
					})

					// mouse move 
					window.addEventListener('mousemove', () => {
						this.domElements.icon.style.opacity = 1

						this.updatePosition()

						this.trigger('move')

						if (!this.isHoveringCursorElement && !this.experience.raycaster.isHovering)
							this.setupDefault()
					})
				}

				updatePosition() {
					if (!this.sizes.touch)
						gsap.to(this.domElements.icon, { x: event.pageX, y: event.pageY, duration: .4, ease: Power3.easeOut })
				}

				setCursorLeavesDoc() {
					document.addEventListener('mouseleave', () => this.cursorIsInsideDoc = false)
					document.addEventListener('mouseenter', () => this.cursorIsInsideDoc = true)
				}

				applyColorSwitchEventListeners() {
					//About (Blue) Color
					const setupAboutColor = () => {
						this.updateBaseColor('#34bfff')
					}

					//Default (orange) color
					const setupDefaultColor = () => {
						this.updateBaseColor('#FF923E')
					}

					this.domElements.colorSwitchContainer.addEventListener('mousemove', () => setupAboutColor())
					this.domElements.colorSwitchContainer.addEventListener('mousenter', () => setupAboutColor())
					this.domElements.aboutSection.addEventListener('mousemove', () => setupAboutColor())
					this.domElements.aboutSection.addEventListener('mouseenter', () => setupAboutColor())
					this.domElements.colorSwitchContainer.addEventListener('mouseleave', () => setupDefaultColor())
					this.domElements.aboutSection.addEventListener('mouseleave', () => setupDefaultColor())
				}

				updateBaseColor(color, force = false) {
					setTimeout(() => {
						if (force || (!document.hidden && (this.cursorIsInsideDoc || this.landingPage.visible) && this.currentBaseColor != color && !this.experience.raycaster.isHovering)) {
							this.currentBaseColor = color

							this.domElements.icon.style.borderColor = this.currentBaseColor
						}
					})
				}

				setupDefault() {
					if (this.currentIcon != 'default' && !this.isHoveringCursorElement && !this.experience.raycaster.isHovering) {
						this.currentIcon = 'default'

						this.domElements.icon.style.borderWidth = '7px'
						this.domElements.icon.style.height = '0'
						this.domElements.icon.style.width = '0'
						this.domElements.icon.style.borderColor = this.currentBaseColor
						this.domElements.content.classList.add('hide')

						if (!this.sizes.touch)
							document.querySelector('body').style.cursor = ''
					}
				}

				setupPointer(element = {}, domElement) {
					if (this.currentIcon != 'pointer') {
						const isInactiveWorkItem = element.class == '.work-item-container' ? domElement.classList.contains('work-inactive-item-container') : true
						const isntDisabledWorkNavigationButton = domElement ? !domElement.classList.contains('work-disabled-navigation-button') : true
						const hasGrayHover = element.class == '.work-item-gray-button' ? domElement.classList.contains('gray-hover') : true

						if (isInactiveWorkItem && isntDisabledWorkNavigationButton && hasGrayHover) {
							setTimeout(() => {
								this.currentIcon = 'pointer'

								this.domElements.icon.style.borderWidth = '5px'
								this.domElements.icon.style.height = '18px'
								this.domElements.icon.style.width = '18px'
								this.domElements.icon.style.borderColor = element.color ? element.color : '#091434'
								this.domElements.icon.style.background = 'transparent'
								this.domElements.content.classList.add('hide')

								if (!this.sizes.touch)
									document.querySelector('body').style.cursor = 'pointer'
							})
						}
					}
				}

				setupCircle(element, domElement) {
					if (this.currentIcon != 'circle') {
						if (element == 'force' ? true : !domElement.classList.contains('active-menu-item')) {
							this.currentIcon = 'circle'

							this.domElements.icon.style.borderWidth = '0'
							this.domElements.icon.style.height = '55px'
							this.domElements.icon.style.width = '55px'
							this.domElements.icon.style.background = element == 'force' ? '#FF923E' : element.color
							this.domElements.content.classList.remove('hide')

							if (!this.intro.clickCTAVisbile && !this.sizes.touch)
								document.querySelector('body').style.cursor = ''
						}
					}
				}

				setHoverColorSwitchHeight() {
					this.domElements.colorSwitchContainer.style.height = this.scroll.aboutContainer.height + (window.innerHeight * (this.sizes.portrait ? 0.03 : 0.15)) + 'px'
				}

				resize() {
					this.setHoverColorSwitchHeight()
				}
			}
		*/
})(jQuery);
