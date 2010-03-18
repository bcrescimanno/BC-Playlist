/*
 * A simple example of building a Brightcove Media API powered playlist using 
 * jQueryUI. 
 * Depends on jQuery 1.4.x, jQueryUI 1.8.x, and BrightcoveHtmlModules.api
 */

(function($){
	
	$.widget("ui.playlist", {
		
		_create: function(){
			if(!this._hasApi()) {
				throw "This widget requires the Brightcove API module"
			}
			
			if(!this._isInitialized()) {
				throw "You must supply an API key and a playlist ID";
			}
			
			BrightcoveHtmlModules.api.setApiKey(this.options.apiKey);
			
			this._generateShell();	
		},
		
		showPlaylist: function() {
			this._requestPlaylistData();
		},
		
		_hasApi: function() {
			return (BrightcoveHtmlModules.api != null);
		},
		
		_isInitialized: function() {
			return (this.options.playlistId && this.options.apiKey);
		},
		
		_requestPlaylistData: function() {
			$("body").bind("bc.foundPlaylistById", $.proxy(this._processResponse, this));
			BrightcoveHtmlModules.api.findPlaylistById(this.options.playlistId);
		},
		
		_processResponse: function(e, data) {
			for(var i = 0; i < data.videos.length; i++) {
				$(this.element).append(this._generateVideoTile(data.videos[i]))
					.show();
			}
		},
		
		_generateVideoTile: function(videoData) {
			return $("<div />")
				.append($("<img />")
					.attr("src", videoData.thumbnailURL)
					.css("float", "left")
					.css("padding-right", '10px')
				)
				.append($("<p />")
					.text(videoData.name)
				)
				.append($("<p />")
					.text(this._generateTimeString(videoData.length))
				)
				.addClass("ui-state-default")
				.css("height", "100px")
				.css("padding", "5px 0 0 5px")
				.css("margin-bottom", "5px")
				.hover(function(){
					$(this).toggleClass("ui-state-hover");
				}) 
		},
		
		_generateTimeString: function(timeInMs) {
			var timeInS = Math.floor(timeInMs / 1000);
			var minutes = Math.floor(timeInS / 60);
			var remainder = (timeInS / 60) - minutes;
			var seconds = Math.floor(remainder * 60);
			return minutes + ":" + seconds;
		},
		
		_generateShell: function() {
			$(this.element).addClass("ui-widget")
				.addClass("ui-widget-content")
				.addClass("ui-corner-all")
				.css("width", this.options.width + "px")
				.css("padding", "10px")
		}
		
	});
	
	$.extend($.ui.playlist.prototype, {
		version: 0.1,
		options: {
			width: 300,
			playlistId: null,
			apiKey: null
		}
	});
	
})(jQuery);

