DEVIANT = {

	images: [],
	pauseTime: 3000,
	current: 0,
	offset: 0,

	launchFullscreen: function ( element )
	{
		if( element.requestFullscreen )
		{
		  element.requestFullscreen();
		}
		else if( element.mozRequestFullScreen )
		{
		  element.mozRequestFullScreen();
		}
		else if( element.webkitRequestFullscreen )
		{
		  element.webkitRequestFullscreen();
		}
		else if( element.msRequestFullscreen )
		{
		  element.msRequestFullscreen();
		}
		else
		{
			console.log( "EAD!" );
		}
	},

	exitFullscreen: function()
	{
		if( document.exitFullscreen )
		{
		  document.exitFullscreen();
		}
		else if( document.mozCancelFullScreen )
		{
		  document.mozCancelFullScreen();
		}
		else if( document.webkitExitFullscreen )
		{
		  document.webkitExitFullscreen();
		}
	},

	init: function()
	{
		this.launchFullscreen( $("#content_item" ) );
		this.startSlideShow();
	},

	startSlideShow: function()
	{
		images = [];
		current = 0;
		$.when( this.loadImages() )
		 .then( function() {
			 DEVIANT.showImages();
		 });
	},

	loadImages: function()
	{
		var dfr = $.Deferred();

		//var site = "http://backend.deviantart.com/rss.xml?q=special:dd";
		var site = "http://backend.deviantart.com/rss.xml?q=boost%3Apopular+meta%3Aall+max_age%3A24h&amp;type=deviation&offset=" + this.offset;
		console.log( site );
		var url = "http://query.yahooapis.com/v1/public/yql?q=" +
				  encodeURIComponent('select * from xml where url="' + site + '"') +
				  "&format=xml&callback=?";
//		console.log( url );

		$.getJSON( url )
		 .done( function( data ) {
			 if( data.results[0] )
			 {
				$( data.results[0] ).find( "media\\:content" ).each( function() {
					DEVIANT.images.push( $( this ).attr( "url" ) );
				});

				dfr.resolve();
			 }
			 else
			 {
				 dfr.reject();
				 throw new Error( "Nothing returned from getJSON." );
			 }
		 })
		 .fail( function() {
			 dfr.reject();
			 throw new Error( "getJSON failed." );
		 });

		 return dfr.promise();
	},

	showImages: function()
	{
		if( this.current < this.images.length )
		{
			$( "#content_item" ).attr( "src", this.images[this.current++] );
			setTimeout( function(){ DEVIANT.showImages(); }, this.pauseTime );
		}
		else
		{
			this.offset += this.current;
			this.startSlideShow();
		}
	},

}
