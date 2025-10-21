;(function () {
	
	'use strict';



	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};


	var counter = function() {
		$('.js-counter').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};


	var counterWayPoint = function() {
		if ($('#colorlib-counter').length > 0 ) {
			$('#colorlib-counter').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( counter , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}
	};

	// Animations
	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};


	var burgerMenu = function() {

		$('.js-colorlib-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');	
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');	
			}
		});



	};

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#colorlib-aside, .js-colorlib-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
	    	
	    }
		});

		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
		});

	};

	var clickMenu = function() {

		console.log('Liens avec data-nav-section trouvés:', $('a[data-nav-section]').length);
	
		$('a[data-nav-section]').click(function(event){
			var section = $(this).data('nav-section'),
				navbar = $('#navbar'),
				$this = $(this),
				href = $this.attr('href');
	
			console.log('Clic détecté sur:', section, 'href:', href);
	
			// ====== NOUVEAU : Vérifier si c'est un lien externe/fichier ======
			// Si le lien a un href qui pointe vers un fichier, URL externe, ou a l'attribut download
			if (href && (
				href.indexOf('.pdf') > -1 || 
				href.indexOf('.doc') > -1 ||
				href.indexOf('.zip') > -1 ||
				href.indexOf('http') === 0 || 
				href.indexOf('mailto:') === 0 ||
				href.indexOf('tel:') === 0 ||
				$this.attr('download') !== undefined ||
				$this.hasClass('btn-learn') // Les boutons btn-learn ne sont pas bloqués
			)) {
				console.log('Lien externe/fichier détecté, navigation autorisée');
				
				// Fermer le menu mobile si ouvert
				if (navbar.length && navbar.is(':visible')) {
					navbar.removeClass('in');
					navbar.attr('aria-expanded', 'false');
					$('.js-colorlib-nav-toggle').removeClass('active');
				}
				
				// Laisser le navigateur gérer le lien normalement
				return true;
			}
	
			// ====== Pour les liens de navigation interne ======
			// Scroll vers la section
			if ( $('[data-section="' + section + '"]').length ) {
				$('html, body').animate({
					scrollTop: $('[data-section="' + section + '"]').offset().top - 55
				}, 500);
		   }
	
			// Fermer le menu mobile s'il est ouvert
			if ( navbar.length && navbar.is(':visible')) {
				navbar.removeClass('in');
				navbar.attr('aria-expanded', 'false');
				$('.js-colorlib-nav-toggle').removeClass('active');
			}
	
			event.preventDefault();
			return false;
		});
	
	};

	// ========================================
// FIX MOBILE - Boutons Hero cliquables
// ========================================
var fixHeroButtons = function() {
	
	console.log('=== FIX HERO BUTTONS START ===');
	
	// 1. Gérer les boutons avec data-scroll-to (navigation interne)
	var $scrollButtons = $('a[data-scroll-to]');
	console.log('Boutons scroll trouvés:', $scrollButtons.length);
	
	$scrollButtons.each(function() {
		var $btn = $(this);
		var section = $btn.data('scroll-to');
		
		// Enlever tous les handlers existants
		$btn.off('click.scroll touchstart.scroll');
		
		// Ajouter le nouveau handler
		$btn.on('click.scroll', function(e) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			
			var $target = $('[data-section="' + section + '"]');
			
			console.log('Click détecté ! Scroll vers:', section, 'Target trouvé:', $target.length > 0);
			
			if ($target.length) {
				$('html, body').animate({
					scrollTop: $target.offset().top - 55
				}, 500);
			} else {
				console.error('Section non trouvée:', section);
			}
			
			return false;
		});
		
		// Forcer les styles
		$btn.css({
			'pointer-events': 'auto',
			'z-index': '999999',
			'position': 'relative',
			'cursor': 'pointer',
			'display': 'inline-block'
		});
	});
	
	// 2. Gérer les boutons de téléchargement
	var $downloadButtons = $('#colorlib-hero a[download]');
	console.log('Boutons download trouvés:', $downloadButtons.length);
	
	$downloadButtons.each(function() {
		var $btn = $(this);
		
		$btn.off('click.download');
		$btn.on('click.download', function(e) {
			e.stopPropagation();
			
			var url = $(this).attr('href');
			console.log('Téléchargement:', url);
			
			// Laisser le navigateur gérer
			return true;
		});
		
		// Forcer les styles
		$btn.css({
			'pointer-events': 'auto',
			'z-index': '999999',
			'position': 'relative',
			'cursor': 'pointer',
			'display': 'inline-block'
		});
	});
	
	// 3. Forcer les styles sur TOUS les boutons du hero
	$('#colorlib-hero .btn, #colorlib-hero .btn-learn, #colorlib-hero a.btn').css({
		'pointer-events': 'auto !important',
		'z-index': '999999',
		'position': 'relative',
		'cursor': 'pointer'
	});
	
	console.log('=== FIX HERO BUTTONS END ===');
};

	// Reflect scrolling in navigation
	var navActive = function(section) {

		var $el = $('#navbar > ul');
		if ($el.length) {
			$el.find('li').removeClass('active');
			$el.each(function(){
				$(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
			});
		}

	};

	var navigationSection = function() {

		var $section = $('section[data-section]');
		
		$section.waypoint(function(direction) {
		  	
		  	if (direction === 'down') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 155; }
		});

	};






	var sliderMain = function() {
	
		$('#colorlib-hero .flexslider').flexslider({
			animation: "fade",
			slideshowSpeed: 5000,
			directionNav: true,
			start: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
					
					// ===== FIX : Réactiver les boutons après le chargement du slider =====
					console.log('Slider chargé, activation des boutons...');
					fixHeroButtons();
				}, 500);
			},
			before: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			},
			after: function(){
				// ===== Réactiver après chaque slide aussi =====
				fixHeroButtons();
			}
		});
	
	};

	var stickyFunction = function() {

		var h = $('.image-content').outerHeight();

		if ($(window).width() <= 992 ) {
			$("#sticky_item").trigger("sticky_kit:detach");
		} else {
			$('.sticky-parent').removeClass('stick-detach');
			$("#sticky_item").trigger("sticky_kit:detach");
			$("#sticky_item").trigger("sticky_kit:unstick");
		}

		$(window).resize(function(){
			var h = $('.image-content').outerHeight();
			$('.sticky-parent').css('height', h);


			if ($(window).width() <= 992 ) {
				$("#sticky_item").trigger("sticky_kit:detach");
			} else {
				$('.sticky-parent').removeClass('stick-detach');
				$("#sticky_item").trigger("sticky_kit:detach");
				$("#sticky_item").trigger("sticky_kit:unstick");

				$("#sticky_item").stick_in_parent();
			}
			

			

		});

		$('.sticky-parent').css('height', h);

		$("#sticky_item").stick_in_parent();

	};

	var owlCrouselFeatureSlide = function() {
		$('.owl-carousel').owlCarousel({
			animateOut: 'fadeOut',
		   animateIn: 'fadeIn',
		   autoplay: true,
		   loop:true,
		   margin:0,
		   nav:true,
		   dots: false,
		   autoHeight: true,
		   items: 1,
		   navText: [
		      "<i class='icon-arrow-left3 owl-direction'></i>",
		      "<i class='icon-arrow-right3 owl-direction'></i>"
	     	]
		})
	};

	// ========================================
// FORMULAIRE DE CONTACT - Fix liens email
// ========================================

// Gestion du formulaire de contact
$('#contactForm').on('submit', function(e) {
	e.preventDefault();
	
	const form = $(this);
	const submitBtn = form.find('button[type="submit"]');
	const originalText = submitBtn.text();
	
	// Désactiver le bouton et changer le texte
	submitBtn.prop('disabled', true);
	submitBtn.text('Sending...');
	
	// Envoyer les données via AJAX
	$.ajax({
		url: form.attr('action'),
		method: 'POST',
		data: form.serialize(),
		dataType: 'json'
	}).done(function(data) {
		// Succès
		submitBtn.text('Message Sent!');
		submitBtn.removeClass('btn-primary').addClass('btn-success');
		form[0].reset();
		
		// Réinitialiser après 3 secondes
		setTimeout(function() {
			submitBtn.prop('disabled', false);
			submitBtn.text(originalText);
			submitBtn.removeClass('btn-success').addClass('btn-primary');
		}, 3000);
		
	}).fail(function(error) {
		// Erreur
		submitBtn.text('Error - Try Again');
		submitBtn.removeClass('btn-primary').addClass('btn-danger');
		
		// Réinitialiser après 3 secondes
		setTimeout(function() {
			submitBtn.prop('disabled', false);
			submitBtn.text(originalText);
			submitBtn.removeClass('btn-danger').addClass('btn-primary');
		}, 3000);
	});
});

// ========================================
// FIX LIENS EMAIL - Desktop et Mobile
// ========================================

// S'assurer que les liens mailto fonctionnent partout
$(document).on('click', 'a[href^="mailto:"]', function(e) {
	// Laisser le navigateur gérer le lien mailto
	// Ne pas empêcher le comportement par défaut
	e.stopPropagation(); // Empêcher la propagation aux parents
	return true; // Laisser le lien fonctionner
});

// Idem pour les liens tel:
$(document).on('click', 'a[href^="tel:"]', function(e) {
	e.stopPropagation();
	return true;
});

// Idem pour les liens externes (GitHub, LinkedIn, etc.)
$(document).on('click', 'a[target="_blank"]', function(e) {
	e.stopPropagation();
	return true;
});

		// Document on load.
	$(function(){
		fullHeight();
		counter();
		counterWayPoint();
		contentWayPoint();
		burgerMenu();

		clickMenu();
		// navActive();
		navigationSection();
		// windowScroll();


		mobileMenuOutsideClick();
		sliderMain();
		stickyFunction();
		owlCrouselFeatureSlide();
		fixHeroButtons();
		contactForm();

		// Load more (projects & certifications)
		$('.btn-load-more').on('click', function(e){
			e.preventDefault();
			var target = $(this).data('target');
			if (!target) return;
			var $grid = $(target);
			$grid.find('.extra-item:hidden').slice(0, 6).slideDown();
			if ($grid.find('.extra-item:hidden').length === 0) {
				$(this).prop('disabled', true).addClass('disabled').text('Tout affiché');
			}
		});

		// Modal details open
		$(document).on('click', '.open-details', function(e){
			e.preventDefault();
			var $container = $(this).closest('.con, .blog-entry');
			var title = $container.data('title') || $container.find('h3').first().text();
			var meta = $container.data('meta') || ($container.data('issuer') ? ($container.data('issuer') + ' | ' + ($container.data('date')||'')) : '');
			var description = $container.data('description') || $container.find('p').first().text();
			var extra = $container.data('extra') || '';
			var pdf = $container.data('pdf') || '';
			var link = $container.data('link') || '';
			
			$('#detailsTitle').text(title);
			
			// Construire les métadonnées avec lien si disponible
			var metaHtml = meta + (extra ? (' | ' + extra) : '');
			if (link) {
				metaHtml += '<br><a href="' + link + '" target="_blank" class="btn btn-sm btn-outline-primary mt-2">Voir le certificat en ligne <i class="icon-external-link"></i></a>';
			}
			$('#detailsMeta').html(metaHtml);
			
			$('#detailsDescription').text(description);
			
			if (pdf) {
				$('#detailsPdf').attr('src', pdf);
				$('#detailsPdfContainer').show();
			} else {
				$('#detailsPdf').attr('src', '');
				$('#detailsPdfContainer').hide();
			}
			$('#detailsModal').modal('show');
		});

		// PDF thumbnails
		if (window['pdfjsLib']) {
			pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
			$('[data-pdf]').each(function(){
				var $entry = $(this);
				var pdfUrl = $entry.data('pdf');
				var $thumb = $entry.find('.pdf-thumb');
				if (!pdfUrl || $thumb.length === 0) return;
				
				// Afficher un placeholder en attendant
				$thumb.html('<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#666;"><i class="icon-file-pdf" style="font-size:2em;margin-bottom:10px;"></i><small>PDF</small></div>');
				
				// Essayer de charger le PDF
				pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf){
					return pdf.getPage(1);
				}).then(function(page){
					var viewport = page.getViewport({ scale: 0.3 });
					var canvas = document.createElement('canvas');
					var context = canvas.getContext('2d');
					canvas.width = viewport.width;
					canvas.height = viewport.height;
					var renderTask = page.render({ canvasContext: context, viewport: viewport });
					return renderTask.promise.then(function(){
						$thumb.empty().append(canvas);
					});
				}).catch(function(error){
					console.log('PDF non trouvé:', pdfUrl, error);
					$thumb.html('<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#999;"><i class="icon-file-pdf" style="font-size:2em;margin-bottom:10px;"></i><small>PDF non disponible</small></div>');
				});
			});
		} else {
			// Fallback si pdf.js n'est pas chargé
			$('[data-pdf]').each(function(){
				var $entry = $(this);
				var $thumb = $entry.find('.pdf-thumb');
				if ($thumb.length === 0) return;
				$thumb.html('<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#666;"><i class="icon-file-pdf" style="font-size:2em;margin-bottom:10px;"></i><small>PDF</small></div>');
			});
		}
	});


	// Load more certifications
$('.btn-load-more').on('click', function(e){
	e.preventDefault();
	var target = $(this).data('target');
	if (!target) return;
	var $grid = $(target);
	var $extraItems = $grid.find('.extra-item:hidden');
	
	if ($extraItems.length > 0) {
		$extraItems.slideDown(600);
		$(this).text('Tout affiché').addClass('disabled').prop('disabled', true);
	}
});

// Modal details certification
$(document).on('click', '.open-details', function(e){
    e.preventDefault();
    var $entry = $(this).closest('.blog-entry');
    
    // CORRECTION : Les data-* sont sur .blog-entry, pas sur un enfant
    var title = $entry.data('title') || '';
    var issuer = $entry.data('issuer') || '';
    var date = $entry.data('date') || '';
    var certId = $entry.data('id') || '';
    var duration = $entry.data('duration') || '';
    var link = $entry.data('link') || '';
    var fullDesc = $entry.data('full-desc') || '';
    var skills = $entry.data('skills') || '';
    var pdf = $entry.data('pdf') || '';
    
    // Titre
    $('#detailsTitle').text(title);
    
    // Meta informations
    var metaHtml = '<strong>' + issuer + '</strong>';
    if (date) metaHtml += ' | ' + date;
    if (certId) metaHtml += ' | ID: ' + certId;
    if (duration) metaHtml += ' | Durée: ' + duration;
    $('#detailsMeta').html(metaHtml);
    
    // Description complète
    $('#detailsFullDesc').text(fullDesc);
    
    // Skills
    if (skills) {
        var skillsArray = skills.split(',').map(function(s){ return s.trim(); });
        var skillsHtml = '';
        skillsArray.forEach(function(skill){
            skillsHtml += '<span style="background:#f0f0f0; padding:5px 12px; border-radius:15px; font-size:13px; margin:4px;">' + skill + '</span>';
        });
        $('#detailsSkillsList').html(skillsHtml);
        $('#detailsSkills').show();
    } else {
        $('#detailsSkills').hide();
    }
    
    // PDF
    if (pdf) {
        $('#detailsPdf').attr('src', pdf);
        $('#detailsPdfContainer').show();
    } else {
        $('#detailsPdf').attr('src', '');
        $('#detailsPdfContainer').hide();
    }
    
    // Lien externe
    if (link) {
        $('#detailsLink').html('<a href="' + link + '" target="_blank" class="btn btn-primary"><i class="icon-external-link"></i> Voir le certificat en ligne</a>');
        $('#detailsLink').show();
    } else {
        $('#detailsLink').hide();
    }
    
    $('#detailsModal').modal('show');
});

// Fermer le modal et réinitialiser l'iframe
$('#detailsModal').on('hidden.bs.modal', function () {
    $('#detailsPdf').attr('src', '');
});


// ========================================
// PROJECTS SECTION - Modal Details
// ========================================

// Load more projects
$(document).on('click', '.btn-load-more[data-target="#projects-grid"]', function(e){
    e.preventDefault();
    var $grid = $('#projects-grid');
    var $extraItems = $grid.find('.extra-item:hidden');
    
    if ($extraItems.length > 0) {
        $extraItems.slideDown(600);
        $(this).text('Tout affiché').addClass('disabled').prop('disabled', true);
    }
});

// Modal details for projects
$(document).on('click', '.project .open-details', function(e){
    e.preventDefault();
    var $container = $(this).closest('.con');
    
    var title = $container.data('title') || '';
    var meta = $container.data('meta') || '';
    var date = $container.data('date') || '';
    var github = $container.data('github') || '';
    var fullDesc = $container.data('full-desc') || '';
    var skills = $container.data('skills') || '';
    var pdf = $container.data('pdf') || '';
    
    // Titre
    $('#detailsTitle').text(title);
    
    // Meta informations
    var metaHtml = '<strong>' + meta + '</strong>';
    if (date) metaHtml += ' | ' + date;
    $('#detailsMeta').html(metaHtml);
    
    // Description complète
    $('#detailsFullDesc').text(fullDesc);
    
    // Skills
    if (skills) {
        var skillsArray = skills.split(',').map(function(s){ return s.trim(); });
        var skillsHtml = '';
        skillsArray.forEach(function(skill){
            skillsHtml += '<span style="background:#f0f0f0; padding:5px 12px; border-radius:15px; font-size:13px; margin:4px;">' + skill + '</span>';
        });
        $('#detailsSkillsList').html(skillsHtml);
        $('#detailsSkills').show();
    } else {
        $('#detailsSkills').hide();
    }
    
    // PDF
    if (pdf) {
        $('#detailsPdf').attr('src', pdf);
        $('#detailsPdfContainer').show();
    } else {
        $('#detailsPdf').attr('src', '');
        $('#detailsPdfContainer').hide();
    }
    
    // Lien GitHub
    if (github) {
        $('#detailsLink').html('<a href="' + github + '" target="_blank" class="btn btn-primary"><i class="icon-github"></i> Voir sur GitHub</a>');
        $('#detailsLink').show();
    } else {
        $('#detailsLink').hide();
    }
    
    $('#detailsModal').modal('show');
});

// PDF thumbnails for projects
if (window['pdfjsLib']) {
    $('.project .con[data-pdf]').each(function(){
        var $container = $(this);
        var pdfUrl = $container.data('pdf');
        var $thumb = $container.find('.pdf-thumb');
        if (!pdfUrl || $thumb.length === 0) return;
        
        // Placeholder en attendant
        $thumb.html('<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#666;"><i class="icon-file-pdf" style="font-size:2em;margin-bottom:10px;"></i><small>PDF</small></div>');
        
        // Charger le PDF
        pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf){
            return pdf.getPage(1);
        }).then(function(page){
            var viewport = page.getViewport({ scale: 0.3 });
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            var renderTask = page.render({ canvasContext: context, viewport: viewport });
            return renderTask.promise.then(function(){
                $thumb.empty().append(canvas);
            });
        }).catch(function(error){
            console.log('PDF non trouvé:', pdfUrl, error);
            $thumb.html('<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#999;"><i class="icon-file-pdf" style="font-size:2em;margin-bottom:10px;"></i><small>PDF non disponible</small></div>');
        });
    });
} else {
    // Fallback
    $('.project .con[data-pdf]').each(function(){
        var $thumb = $(this).find('.pdf-thumb');
        if ($thumb.length === 0) return;
        $thumb.html('<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#666;"><i class="icon-file-pdf" style="font-size:2em;margin-bottom:10px;"></i><small>PDF</small></div>');
    });
}

// ========================================
// MODE SOMBRE SIMPLE
// ========================================
$('#darkModeToggle').click(function() {
	$('body').toggleClass('dark-mode');
	
	if ($('body').hasClass('dark-mode')) {
		localStorage.setItem('darkMode', 'on');
		$(this).find('.mode-icon').text('☀️');
		$(this).find('.mode-text').text('Mode Clair');
	} else {
		localStorage.setItem('darkMode', 'off');
		$(this).find('.mode-icon').text('🌙');
		$(this).find('.mode-text').text('Mode Sombre');
	}
});

// Charger la préférence
if (localStorage.getItem('darkMode') === 'on') {
	$('body').addClass('dark-mode');
	$('#darkModeToggle .mode-icon').text('☀️');
	$('#darkModeToggle .mode-text').text('Mode Clair');
}

// ========================================
// SYSTÈME DE LANGUE
// ========================================

// Dictionnaire des traductions
const translations = {
	// Navigation
	'Accueil': 'Home',
	'A Propos': 'About',
	'Compétences': 'Skills',
	'Formation': 'Education',
	'Experience': 'Experience',
	'Projets': 'Projects',
	'Certifications': 'Certifications',
	'Événements': 'Events',
	'Contact': 'Contact',
	
	// Hero Section
	'Hi! <br>I\'m Cheickna': 'Hi! <br>I\'m Cheickna',
	'Élève Ingénieur Cyber Défense | SOC Analyst - Threat Hunting & Forensics': 'Cyber Defense Engineering Student | SOC Analyst - Threat Hunting & Forensics',
	'Télécharger le CV': 'Download CV',
	'I am <br>a Cybersecurity Specialist': 'I am <br>a Cybersecurity Specialist',
	'Passionate about Threat Detection, Incident Response & Security Operations': 'Passionate about Threat Detection, Incident Response & Security Operations',
	'Voir les projets': 'View Projects',
	
	// About Section
	'A Propos de Moi': 'About Me',
	'Qui Suis-Je?': 'Who Am I?',
	'Élève Ingénieur Cyber Défense | SOC Analyst': 'Cyber Defense Engineering Student | SOC Analyst',
	'Je poursuis un cycle d\'ingénieur en Génie Cyber Défense et Systèmes de Télécommunication Embarqués à l\'ENSA Marrakech. Passionné par la sécurité offensive et défensive, je me spécialise dans l\'analyse forensique, le threat hunting et la réponse aux incidents.': 'I am pursuing an engineering degree in Cyber Defense Engineering and Embedded Telecommunications Systems at ENSA Marrakech. Passionate about offensive and defensive security, I specialize in forensic analysis, threat hunting and incident response.',
	'Mon approche combine une solide formation théorique avec une pratique intensive sur des plateformes comme TryHackMe, LetsDefend et HackTheBox. Je suis particulièrement intéressé par les technologies SIEM, l\'analyse de malware, et l\'automatisation de la sécurité via DevSecOps.': 'My approach combines solid theoretical training with intensive practice on platforms like TryHackMe, LetsDefend and HackTheBox. I am particularly interested in SIEM technologies, malware analysis, and security automation via DevSecOps.',
	'Au-delà de la cybersécurité, je co-fonde actuellement HayTech, un projet innovant de dispositif médical portable utilisant l\'IA pour la détection précoce de maladies chroniques.': 'Beyond cybersecurity, I am currently co-founding HayTech, an innovative portable medical device project using AI for early detection of chronic diseases.',
	'Prêt à intégrer une équipe SOC<br>avec une forte curiosité technique et un sens du détail': 'Ready to join a SOC team<br>with strong technical curiosity and attention to detail',
	'Contactez-moi': 'Contact Me',
	
	// Skills Section
	'Mon Expertise': 'My Expertise',
	'Technical Skills': 'Technical Skills',
	'Compétences techniques développées à travers mes formations, certifications et projets pratiques en cybersécurité offensive et défensive.': 'Technical skills developed through my training, certifications and practical projects in offensive and defensive cybersecurity.',
	
	// Education Section
	'Formation': 'Education',
	'Historique Académique': 'Academic History',
	'Cycle d\'Ingénieur : Génie Cyber Défense': 'Engineering Cycle: Cyber Defense Engineering',
	'ENSA Marrakech': 'ENSA Marrakech',
	'Spécialisation en Génie Cyber Défense et Systèmes de Télécommunication Embarqués avec focus sur la sécurité opérationnelle, l\'analyse forensique et le threat hunting.': 'Specialization in Cyber Defense Engineering and Embedded Telecommunications Systems with focus on operational security, forensic analysis and threat hunting.',
	'Formation couvrant les domaines de la sécurité des réseaux, cryptographie, sécurité des systèmes embarqués, intelligence artificielle appliquée à la cybersécurité et DevSecOps.': 'Training covering network security, cryptography, embedded systems security, artificial intelligence applied to cybersecurity and DevSecOps.',
	'Cycle Préparatoire : Sciences et Techniques': 'Preparatory Cycle: Science and Technology',
	'ENSA Safi': 'ENSA Safi',
	'Classes préparatoires intégrées avec formation en mathématiques appliquées, physique, informatique et sciences de l\'ingénieur. Développement des bases solides en programmation et algorithmique.': 'Integrated preparatory classes with training in applied mathematics, physics, computer science and engineering sciences. Development of solid foundations in programming and algorithms.',
	'Baccalauréat Sciences Exactes - Mention Bien': 'Bachelor of Exact Sciences - Good Mention',
	'Lycée Privé Mamba, Bamako, Mali': 'Private Mamba High School, Bamako, Mali',
	'Diplôme obtenu avec mention Bien en sciences exactes (mathématiques, physique, chimie).': 'Diploma obtained with Good mention in exact sciences (mathematics, physics, chemistry).',
	
	// Experience Section
	'Expérience': 'Experience',
	'Expérience Professionnelle': 'Professional Experience',
	'Co-fondateur & Porteur de Projet': 'Co-founder & Project Leader',
	'Développement d\'un dispositif médical portable d\'analyse de l\'haleine pour détection précoce de maladies chroniques. Sélectionné Top 20 parmi 400+ projets. 3 prix obtenus dont Meilleur Projet Innovant. Stack: ESP32/Raspberry Pi, IA embarquée, Flutter.': 'Development of a portable medical device for breath analysis for early detection of chronic diseases. Selected Top 20 among 400+ projects. 3 awards including Best Innovative Project. Stack: ESP32/Raspberry Pi, embedded AI, Flutter.',
	'Stagiaire Ingénieur Cyber Sécurité': 'Cybersecurity Engineering Intern',
	'Conception d\'un Security Dashboard automatisant les analyses SAST/DAST. Intégration de 9 outils de sécurité (OWASP ZAP, CodeQL, Semgrep). Réduction de 70% du temps d\'analyse. Technologies: Node.js, Express.js, Docker, Chart.js.': 'Design of a Security Dashboard automating SAST/DAST analyses. Integration of 9 security tools (OWASP ZAP, CodeQL, Semgrep). 70% reduction in analysis time. Technologies: Node.js, Express.js, Docker, Chart.js.',
	
	// Projects Section
	'Mes Travaux': 'My Works',
	'Projets Principaux': 'Main Projects',
	'Voir tous les projets': 'View All Projects',
	'Tout affiché': 'All Shown',
	
	// Certifications Section
	'Réalisations': 'Achievements',
	'Voir tout': 'View All',
	'Voir plus': 'View More',
	
	// Events Section
	'Participation': 'Participation',
	'Événements & Compétitions': 'Events & Competitions',
	
	// Contact Section
	'Get in Touch': 'Get in Touch',
	'Name': 'Name',
	'Email': 'Email',
	'Subject': 'Subject',
	'Message': 'Message',
	'Send Message': 'Send Message',
	
	// Buttons
	'Mode Sombre': 'Dark Mode',
	'Mode Clair': 'Light Mode',
	'Français': 'French',
	'English': 'English'
};

// Fonction pour traduire le contenu
function translateContent(language) {
	const isEnglish = language === 'en';
	
	// Traduire tous les éléments avec data-translate
	$('[data-translate]').each(function() {
		const key = $(this).data('translate');
		const translation = translations[key];
		if (translation) {
			if (isEnglish) {
				$(this).text(translation);
			} else {
				$(this).text(key);
			}
		}
	});
	
	// Traduire les éléments avec data-translate-html
	$('[data-translate-html]').each(function() {
		const key = $(this).data('translate-html');
		const translation = translations[key];
		if (translation) {
			if (isEnglish) {
				$(this).html(translation);
			} else {
				$(this).html(key);
			}
		}
	});
	
	// Traduire les placeholders
	$('[data-translate-placeholder]').each(function() {
		const key = $(this).data('translate-placeholder');
		const translation = translations[key];
		if (translation) {
			if (isEnglish) {
				$(this).attr('placeholder', translation);
			} else {
				$(this).attr('placeholder', key);
			}
		}
	});
	
	// Traduire les valeurs des boutons
	$('[data-translate-value]').each(function() {
		const key = $(this).data('translate-value');
		const translation = translations[key];
		if (translation) {
			if (isEnglish) {
				$(this).attr('value', translation);
			} else {
				$(this).attr('value', key);
			}
		}
	});
	
	// Mettre à jour le bouton de langue
	if (isEnglish) {
		$('#languageToggle .language-icon').text('Fr');
		$('#languageToggle .language-text').text('Français');
		$('body').addClass('english-mode');
	} else {
		$('#languageToggle .language-icon').text('En');
		$('#languageToggle .language-text').text('English');
		$('body').removeClass('english-mode');
	}
}

// Basculement de langue
$('#languageToggle').click(function() {
	const currentLang = localStorage.getItem('language') || 'fr';
	const newLang = currentLang === 'fr' ? 'en' : 'fr';
	
	localStorage.setItem('language', newLang);
	translateContent(newLang);
});

// Charger la langue au démarrage
$(document).ready(function() {
	const savedLang = localStorage.getItem('language') || 'fr';
	translateContent(savedLang);
});

// ========================================
// FORMULAIRE DE CONTACT
// ========================================

// Gestion du formulaire de contact
$('#contactForm').on('submit', function(e) {
	e.preventDefault();
	
	const form = $(this);
	const submitBtn = form.find('button[type="submit"]');
	const originalText = submitBtn.text();
	
	// Désactiver le bouton et changer le texte
	submitBtn.prop('disabled', true);
	submitBtn.text('Sending...');
	
	// Envoyer les données via AJAX
	$.ajax({
		url: form.attr('action'),
		method: 'POST',
		data: form.serialize(),
		dataType: 'json'
	}).done(function(data) {
		// Succès
		submitBtn.text('Message Sent!');
		submitBtn.removeClass('btn-primary').addClass('btn-success');
		form[0].reset();
		
		// Réinitialiser après 3 secondes
		setTimeout(function() {
			submitBtn.prop('disabled', false);
			submitBtn.text(originalText);
			submitBtn.removeClass('btn-success').addClass('btn-primary');
		}, 3000);
		
	}).fail(function(error) {
		// Erreur
		submitBtn.text('Error - Try Again');
		submitBtn.removeClass('btn-primary').addClass('btn-danger');
		
		// Réinitialiser après 3 secondes
		setTimeout(function() {
			submitBtn.prop('disabled', false);
			submitBtn.text(originalText);
			submitBtn.removeClass('btn-danger').addClass('btn-primary');
		}, 3000);
	});
});

// Alternative: Mailto avec informations pré-remplies
function sendMailto() {
	const subject = encodeURIComponent("Contact depuis votre portfolio");
	const body = encodeURIComponent("Bonjour Cheickna,\n\nJe vous contacte depuis votre portfolio...\n\nCordialement,");
	window.location.href = `mailto:cheicknasanogo223@gmail.com?subject=${subject}&body=${body}`;
}
}());