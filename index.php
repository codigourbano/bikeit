<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>" />
<title><?php
	global $page, $paged;

	wp_title( '|', true, 'right' );

	bloginfo( 'name' );

	$site_description = get_bloginfo('description', 'display');
	if ( $site_description && ( is_home() || is_front_page() ) )
		echo " | $site_description";

	if ( $paged >= 2 || $page >= 2 )
		echo ' | ' . __('Page', 'bikeit') . max($paged, $page);

	?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo('stylesheet_url'); ?>" />
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/img/favicon.ico" type="image/x-icon" />
<?php wp_head(); ?>
</head>
<body <?php body_class(get_bloginfo('language')); ?> ng-controller="SiteController">

	<header id="masthead">

		<div class="container">
			<div class="two columns">
				<h1><a href="javascript:void(0);" ng-click="goHome()"><?php bloginfo('name'); ?><img src="<?php echo get_template_directory_uri(); ?>/img/logo.png" /></a></h1>
			</div>
			<div class="ten columns alpha">
				<?php
				if(is_multisite()) {
					$sites = wp_get_sites();
					if(!empty($sites)) {
						$current = get_current_blog_id();
						$name = trim(str_replace('BikeIt', '', get_bloginfo('name')));
						echo '<div class="ms-dropdown-title">';
						echo '<h2 class="side-title">' . $name . '<span class="icon-triangle-down"></span></h2>';
						echo '<div class="ms-dropdown">';
							echo '<input type="text" placeholder="' . __('Search cities', 'bikeit') . '" ng-model="msSearch" />';
							$parsed_sites = array();
							foreach($sites as $site) {
								if($current != $site['blog_id']) {
									$details = get_blog_details($site['blog_id']);
									$name = trim(str_replace('BikeIt', '', $details->blogname));
									$parsed_sites[] = array(
										'url' => $details->siteurl,
										'name' => $name
									);
								}
							}
							echo "<ul ng-init='mSites = " . json_encode($parsed_sites) . "'>";
							echo '<li ng-repeat="site in mSites | filter:msSearch"><a href="{{site.url}}">{{site.name}}</a></li>';
							echo '</ul>';
						echo '</div>';
						echo '</div>';
					}
				}
				?>
				<nav id="main-nav">
					<?php wp_nav_menu(); ?>
				</nav>
				<div class="user" ng-controller="UserController" ng-show="loadedUser">
					<div class="user-nav" ng-show="user">
						<img ng-src="{{user.avatar}}" alt="{{user.name}}" />
						<p><a href="javascript:void(0);" ng-click="accessUser()">{{user.name}}</a><a class="logout" href="{{logoutUrl}}">{{labels('Logout')}}</a></p>
						<div class="user-nav-menu">
							<ul>
								<li><a href="javascript:void(0);" ng-click="accessUser()">{{labels('My profile')}}</a></li>
								<li><a href="javascript:void(0);">{{labels('Edit my profile')}}</a></li>
								<li ng-show="user.roles[0] == 'administrator'"><a href="{{adminUrl}}" target="_self">{{labels('Control panel')}}</a></li>
								<li><a href="{{logoutUrl}}">{{labels('Logout')}}</a></li>
							</ul>
						</div>
					</div>
					<div ng-hide="user">
						<p><a class="button" href="#" ng-click="loginForm()">{{labels('Login/Register')}}</a></p>
					</div>
				</div>
			</div>
		</div>

	</header>

	<div ui-view autoscroll="false"></div>

	<footer id="colophon">

		<div class="colophon-content container">
			<div class="four columns">
				&nbsp;
			</div>
			<div class="four columns">
				<div class="footer-logo"></div>
				<p class="site-desc">{{labels('Collaborative mapping bike-friendly city spots')}}</p>
			</div>
			<div class="four columns">
				&nbsp;
			</div>
		</div>

	</footer>

	<?php wp_footer(); ?>

</body>
</html>