DEVIANT = {

	images: [],
	current: 0,
	pauseTime: 3000,

	init: function()
	{
		images = [];
		$.when( this.loadImages() )
		 .then( function() {
			 DEVIANT.showImages();
		 });
	},

	loadImages: function()
	{
		var dfr = $.Deferred();

		//var site = "http://backend.deviantart.com/rss.xml?q=special:dd";
		var site = "http://backend.deviantart.com/rss.xml";
		var url = "http://query.yahooapis.com/v1/public/yql?q=" +
				  encodeURIComponent('select * from xml where url="' + site + '"') +
				  "&format=xml&callback=?";

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
			this.init();
		}
	},

}
