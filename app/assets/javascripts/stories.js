/*
 * 
 * 
 */

var APP = APP || {};

APP.Story = {};

APP.Story.init = function () {
  this.projectId = $("#project-id").val();
  this.addEvents(); 
}

APP.Story.addEvents = function () {
  
  /**  
    * epic stories
    */
  
  $("#save-story-details").click(function () {
    
    var data = APP.Story.serializeData(),
      $modal = $("#story-modal");

    if ($modal.attr("data-is-new") === "true") {
      APP.Story.insertRecord(data);
      
    } else {
      
      data.id = $modal.attr("data-story-id");     
      APP.Story.updateRecord(data); 
    }   
	$(".modal-backdrop").remove();
    $modal.addClass("hide");
    APP.Story.removeNoStoriesText();
  });
  
  $(".add-story-menu i, .add-new-story").live("click", function () {
    
    var $this = $(this),
      $modal = $("#story-modal"),
      $modalBg = $('<div class="modal-backdrop  in"></div>');
    
    switch ($this.attr("class").split(" ")[0]) {
      case "add-new-story":
      	$modal.find(".modal-header h3").text("Create story");
        $modal.attr("data-is-new", "true");   
        $modal.attr("data-epic-id", $this.parent().attr("data-epic-id"));     
        $modal.removeClass("hide"); 
        $("body").append($modalBg);
        APP.Story.populateForm(); 
      break;
      case "icon-pencil":
      	$modal.find(".modal-header h3").text("Update story");
        $modal.attr("data-is-new", "false");
        $modal.attr("data-story-id", $this.parent().attr("data-story-id"));
        $modal.attr("data-epic-id", $this.closest(".stories").attr("id").split("_")[1]);
        $modal.removeClass("hide"); 
        $("body").append($modalBg);
        APP.Story.populateForm(); 
      break;
      case "icon-share":      
		APP.Story.showSprintsMenu($this);       
      break;
      case "icon-remove":
        APP.Story.remove($this);
      break;      
    }

  });   
  
   	$(".close-modal, button.close").click(function () {
		var $m = $(this).closest(".modal");
		
		if ($m.attr("id") === "epics-modal") {
			$m.modal("hide");
		} else if ($m.attr("id") === "story-modal") {
			$m.addClass("hide");
		}	
		$(".modal-backdrop").remove();
	});
	
	$(".sprints-menu li").live("click", function () {
		
		var $this = $(this),
			storyId = $this.closest(".add-story-menu").attr("data-story-id"),
			sprintId = $this.attr("id").split("_")[1],
			data = {};
		
		data.story = {};
		data.story.sprint_id = sprintId;
		
		$.ajax({
			type : "put",
			url : APP.baseUrl + "stories/" + storyId + ".json",
			data : data,
			dataType : "json",
			success : function () {
				alert("Story successfull moved to another iteration.");
				$(".sprints-menu").hide();				
			},
			error : function () { alert("Failed to move story to sprint."); }			
		});				
	});
	
	$("body").click(function () {
		$(".sprints-menu").hide();
	});
   
}

APP.Story.removeNoStoriesText  = function () {
	$(".no-stories-text").hide();	
};


APP.Story.removeSprintMenus = function () {
	
	$(".sprints-menu").remove();	
}

APP.Story.showSprintsMenu = function($this) {

	APP.Story.removeSprintMenus();
	
	$.get(APP.baseUrl + "sprints.json", function (data) {

		var menuHtml = "", subMenu = "";
		
		menuHtml += '<ul class="sprints-menu dropdown-menu" style="top:' + $this.position().top + 'px; left:' + ($this.position().left + 15) + 'px;">';
		for (var i = 0, len = data.length; i < len; i++) {
			subMenu += '<li id="sprint_' + data[i].id + '"><a href ="javascript:void(0);">' + data[i].name + '</a></li>';
			
		}          
		
		if (subMenu == "") {
			subMenu = "No sprint defined";
		}
		menuHtml += subMenu;
		      
		menuHtml += '</ul>';
		
		$this.parent().append(menuHtml);
		
							
	});
	
}     

APP.Story.serializeData = function () {

  var data = {},
    $form = $("#story-form");
  
  data.story = {};
  data.story.summary = $form.find("textarea[name='story[summary]']").val();
  data.story.details = $form.find("textarea[name='story[details]']").val();
  data.story.points = $form.find("input[name='story[points]']").val();
  data.story.status_id = $form.find("select[name='story[status_id]']").val();
  data.story.story_type_id = $form.find("select[name='story[type_id]']").val();
  data.story.sprint_id = $form.find("select[name='story[sprint_id]']").val();
  data.story.user_id = $form.find("select[name='story[user_id]']").val();
  data.story.project_id = APP.Story.projectId;
  data.story.epic_id = $form.find("select[name='story[epic_id]']").val();
  
  for (item in data.story) {
    if (parseInt(data.story[item]) === -1) {
      delete data.story[item];
    }
  }
  
  return data; 
}

APP.Story.insertRecord = function (storyData) {
  
  $.ajax({
    type : "post",
    url : APP.baseUrl + "stories",
    data : storyData,
    dataType : "json",
    success : function (data) {
      APP.Story.createHtml(data);
    },
    error : function () { alert("Failed to create a story."); }
  });
}

APP.Story.createHtml = function (data) {
  
  var $ul = $("#stories-wrapper"),
    li = "<li id='story_" + data.id + "'>" + data.summary + "<span class='add-story-menu' data-story-id='" + data.id + "'><i class='icon-remove'></i><i class='icon-pencil'></i><i class='icon-share'></i></span></li>";
    
  $ul.append(li);         
}
/*
APP.Story.appendChildren = function (epicId) {
  
  $.ajax({
    type : "get",
    url : APP.baseUrl + "epics/getChildStories.json?id=" + epicId,
    success : function (data) {
      for (var i = 0, len = data.length; i < len; i++) {
        APP.Story.createHtml(data[i]);
      }
    },
    error : function () {
      alert("Failed to fetch epic child stories");
    }
  });
}
*/
APP.Story.populateForm = function () {

  var $modal = $("#story-modal");

    // now populate form
    if ($modal.attr("data-is-new") === "true") {
        
      $modal.find("textarea[name='story[summary]']").val("");
      $modal.find("textarea[name='story[details]']").val("");
      $modal.find("input[name='story[points]']").val("");
      $modal.find("select[name='story[status_id]']").val("");
      $modal.find("select[name='story[type_id]']").val("");
      $modal.find("select[name='story[sprint_id]']").val("");
      $modal.find("select[name='story[user_id]']").val("");   
      $modal.find("select[name='story[epic_id]']").val($modal.attr("data-epic-id"));    
    
    } else if ($modal.attr("data-is-new") === "false") {
      
      $.get(APP.baseUrl + "stories/" + $modal.attr("data-story-id") + ".json", function (data) {
  
        $modal.find("textarea[name='story[summary]']").val(data.summary);
        $modal.find("textarea[name='story[details]']").val(data.details);
        $modal.find("input[name='story[points]']").val(data.points);
        $modal.find("select[name='story[status_id]']").val(data.status_id);
        $modal.find("select[name='story[type_id]']").val(data.story_type_id);
        $modal.find("select[name='story[sprint_id]']").val(data.sprint_id);
        $modal.find("select[name='story[user_id]']").val(data.user_id); 
        $modal.find("select[name='story[epic_id]']").val($modal.attr("data-epic-id"));    
      });
    }           
}

APP.Story.updateRecord = function (storyData) {

  $.ajax({
    type : "put",
    url : APP.baseUrl + "stories/" + storyData.id + ".json",
    data : storyData,
    dataType : "json",
    success : function (data) {
      APP.Story.updateHtml(storyData);
    },
    error : function () { alert("Failed to update an epic."); }
  }); 
}

APP.Story.updateHtml = function (data) {

  var $story = $("#story_" + data.id);
    
  $story.html(data.story.summary + '<span class="add-story-menu" data-story-id="' + data.id + '"><i class="icon-remove"></i><i class="icon-pencil"></i><i class="icon-share"></i></span>'); 
    
}

APP.Story.remove = function ($icon) {
  
  if (confirm("Are you sure you want to delete this story?")) {
    
    $.ajax({
      type : "delete",
      url : APP.baseUrl + "stories/" + $icon.parent().attr("data-story-id") + ".json",
      success : function () {
        $("#story_" + $icon.parent().attr("data-story-id")).remove();
        alert("Story successfully deleted");
      },
      error : function () {
        alert("Failed to delete story");
      }
    });
  }   
}

// 

$(document).ready(function () {
  APP.Story.init();
});