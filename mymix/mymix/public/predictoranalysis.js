$(function() {  
    $('form').submit(function(event) {
      event.preventDefault();
      
      let song = $('input[name="song"').val();
      let artist = $('input[name="artist"]').val();
      
      $.get('/feature_table?' + $.param({song: song, artist: artist}), function(data) {
        $('input[type="text"]').val('');
        $('input').focus();
        
        
        //let obj = jQuery.parseJSON( data );

        let table = data.trackdf;
        let link = data.link;
        let artists = data.artists;
        let hits = data.hit_list;
        let topthree = data.top_three;
        let album_popularity = data.popularity;
       
        const albumDiv = document.getElementById('albumlink');
        while (albumDiv.firstChild) {
          albumDiv.removeChild(albumDiv.firstChild);
        }  
        albumDiv.appendChild(StoryDOMObject(link,artists,newtab=true));
      

      
        
        const predictionDiv = document.getElementById('prediction');
        if(hits == ''){
          predictionDiv.innerHTML = '<div> no song seem to pass the hit song threshold, but may as well look at the following three songs with top scores </div>';
        }else{predictionDiv.innerHTML = hits;}
        

        const scoreDiv = document.getElementById('score');
        scoreDiv.innerHTML =  topthree;
      

        const albumPopDiv = document.getElementById('album');
        albumPopDiv.innerHTML = '<div> (album popularity score: ' + album_popularity + ') </div>';

        const tableDiv = document.getElementById('print');
        
        tableDiv.innerHTML = table;


        
         
         
        
        });
        return false;
      });
    });
  

    function StoryDOMObject(web_link,artist,newtab=false) {
      const card = document.createElement('div');
      // card.setAttribute('id', storyJSON._id);
      card.className = 'story card';
    
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      card.appendChild(cardBody);
    
      const creatorSpan = document.createElement('a');
      creatorSpan.className = 'story-creator card-title';
      creatorSpan.innerHTML = artist;
      creatorSpan.setAttribute('href', web_link);
      if(newtab == true){
        creatorSpan.target = "_blank"
      }
      cardBody.appendChild(creatorSpan);
    
      // const contentSpan = document.createElement('p');
      // contentSpan.className = 'story-content card-text';
      // console.log(storyJSON );
      // contentSpan.innerHTML = storyJSON.energy;
      // cardBody.appendChild(contentSpan);
    
      const cardFooter = document.createElement('div');
      cardFooter.className = 'card-footer';
      card.appendChild(cardFooter);
    
    
      return card;
    }