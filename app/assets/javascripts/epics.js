/**
 * Epics UI 
 */

var APP = APP || {};

APP.Epics = {};

APP.Epics.init = function () {
	this.projectId = $("#project-id").val();
	this.addEvents();	
}

APP.Epics.addEvents = function () {
	
	// on add or update epics
	$("#add-new-epic, .add-new-child-epic, .epic-box .title i.editEpic").live("click", function () {		
		var $modal = $("#epics-modal"),
			$this = $(this),
			$deleteBtn = $("#delete-epic");
		
		$deleteBtn.hide();
		$modal.find(".modal-header h3").text("Create epic");
		
		if ($this.hasClass("add-new-child-epic")) {		
						
			$modal.attr("data-parent-id", $this.parent().attr("data-epic-id"));	
			$modal.attr("data-is-new", "true");		
			
		} else if ($this.attr("id") === "add-new-epic"){			
			$modal.attr("data-parent-id", -1);		
			$modal.attr("data-is-new", "true");	
			
		} else if ($this.parent().hasClass("title")){
			
			$modal.find(".modal-header h3").text("Update epic");
			$modal.attr("data-epic-id", $this.text().replace("E#",""));
			$modal.attr("data-is-new", "false");
			$deleteBtn.show();
		}
		
		APP.Epics.populateForm();
	});
	
	$("#delete-epic").click(function () {
		APP.Epics.deleteEpic();
	})
	
	$("#save-epic-details").click(function () {
		
		var data = APP.Epics.serializeData(),
			$modal = $("#epics-modal");
			
		if ($modal.attr("data-is-new") === "true") {
			APP.Epics.insertRecord(data);
			
		} else if ($modal.attr("data-is-new") === "false"){
			
			data.id = $modal.attr("data-epic-id");			
			APP.Epics.updateRecord(data);	
		}		

		$("#epics-modal").modal("hide");
	});
	
	$(".close-modal, button.close").click(function () {
		var $m = $(this).closest(".modal");
		
		if ($m.attr("id") === "epics-modal") {
			$m.modal("hide");
		} else if ($m.attr("id") === "story-modal") {
			$m.addClass("hide");
			$(".modal-backdrop").remove();
		}	
	});
	
	$(".epic-box").find("i").live("click", function () {
		var $this = $(this),
			$epic = $this.closest(".epic-box"),
			epicId = $epic.attr("id").split("_")[1];		
				
		if ($epic.attr("data-loaded") === "false" || $epic.attr("data-loaded") === undefined) { 
			$.ajax({
				type : "get",
				url : APP.baseUrl + "epics/getChildEpics.json?id=" + epicId,
				success : function (data) {
					APP.Epics.appendChildren(data);					
					APP.Epics.toggleVisibility($this, $epic);	
					$epic.attr("data-loaded", "true");	
					
					APP.Epics.Story.appendChildren(epicId);			
				},
				error : function () { alert("Failed to retreive child epics"); } 				
			});
		} else {
			APP.Epics.toggleVisibility($this, $epic); 
		}
	});
	
	/**	 
	  * epic stories
	  */
	 /*
	 $(".add-new-story").live("click", function() {
		var $modal = $("#story-modal");
		
		$modal.attr("data-is-new", "true");
		$modal.attr("data-epic-id", $(this).parent().attr("data-epic-id"));
		$modal.removeClass("hide");		 		
	 });
	 */
	$("#save-story-details").click(function () {
		
		var data = APP.Epics.Story.serializeData(),
			$modal = $("#story-modal");

		if ($modal.attr("data-is-new") === "true") {
			APP.Epics.Story.insertRecord(data);
			
		} else {
			
			data.id = $modal.attr("data-story-id");			
			APP.Epics.Story.updateRecord(data);	
		}		
		$(".modal-backdrop").remove();
		$modal.addClass("hide");
	});
	
	$(".add-story-menu i, .add-new-story").live("click", function () {
		
		var $this = $(this),
			$modal = $("#story-modal"),
			$modalBg = $('<div class="modal-backdrop  in"></div>');
		
		switch ($this.attr("class")) {
			case "add-new-story":
				$modal.attr("data-is-new", "true");		
				$modal.attr("data-epic-id", $this.parent().attr("data-epic-id"));
				$modal.find("h3").text("Create story");			
				$modal.removeClass("hide");	
				$("body").append($modalBg);
				APP.Epics.Story.populateForm();	
			break;
			case "icon-pencil":
				$modal.attr("data-is-new", "false");
				$modal.attr("data-story-id", $this.parent().attr("data-story-id"));
				$modal.attr("data-epic-id", $this.closest(".stories").attr("id").split("_")[1]);
				$modal.find("h3").text("Update story");
				$modal.removeClass("hide");	
				$("body").append($modalBg);
				APP.Epics.Story.populateForm();	
			break;
			case "icon-remove":
				APP.Epics.Story.remove($this);
			break;			
		}
	});		 
	 
}

APP.Epics.appendChildren = function (data) {
	
	for (var i = 0, len = data.length; i < len; i++) {		
		APP.Epics.createHtml(data[i]);
	}	
}

APP.Epics.toggleVisibility = function ($icon, $epic) {
	
	if ($icon.hasClass("icon-plus")) {
		$icon.removeClass("icon-plus");
		$icon.addClass("icon-minus");			
		$epic.removeClass("min");
	} else if ($icon.hasClass("icon-minus")) {
		$icon.removeClass("icon-minus");
		$icon.addClass("icon-plus");			
		$epic.addClass("min");			
	}		
}

APP.Epics.populateForm = function () {
	
	var $modal = $("#epics-modal");

	if ($modal.attr("data-is-new") === "true") {
		
		// first refresh dynamic epic list		
		$.get( APP.baseUrl + "epics.json?project_id=" + APP.Epics.projectId, function (data) {
			
			APP.Epics.refreshList(data, "epic");
			
			$modal.find("input[name='name']").val("");
			$modal.find("textarea[name='description']").val("");		
			$modal.find("select[name='epic']").val( $modal.attr("data-parent-id") ); 	
			$modal.modal("show");						
		}); 	
		
	} else if ($modal.attr("data-is-new") === "false") {
		
		// refresh dynamic epic list which will exlude child epics
		// so there is no option for existing epics to be assigned to 
		// one of it's child epics
		
		var epicId = $modal.attr("data-epic-id"),
			data = APP.Epics.filterOutChildEpics(epicId);
		
		APP.Epics.refreshList(data, "epic");
		
		$.get(APP.baseUrl + "epics/" + epicId + ".json", function (data) {
			
			var epicId = -1;
			
			if (data.epic_id !== null) { 
				epicId = data.epic_id; 
			}	
					
			$modal.find("input[name='name']").val(data.name);
			$modal.find("textarea[name='description']").val(data.description);
			$modal.find("select[name='epic']").val(epicId); 			
			$modal.modal("show");	
		});
	}	
}

/**
 * Returns an array of epic objects which are parents to epicId or which are un-related to epicId
 */
APP.Epics.filterOutChildEpics = function (epicId) {
	
	// clone container of all epics so manipulation doesn't affect actual DOM
	var $container = $("#epic-container").clone(),
		data = [];
		
	// remove the reference epic and it's children	
	$container.find("#epic_" + epicId).remove();
	
	// get rest of the epics and populate data
	$container.find(".epic-box").each(function(i) {
		var $this = $(this).clone(),
			item = {};
		
		// get the id and name
		$this.find(".child-epics").remove(); 
		item.id = $this.attr("id").split("_")[1];
		item.name = $this.find("span.e-title").text();
		data.push(item);
	});										
	
	return data;
}

APP.Epics.refreshList = function (data, type) {
	
	var $ddl = null;
		$epics = $("#epics-modal").find("select[name='epic']"),
		options = [];

	if (type == "epic") {
		$ddl = $("#epics-modal").find("select[name='epic']");
	} else if (type == "story") {
		$ddl = $("#story-modal").find("select[name='story[epic_id]']");
	}
	
	options.push('<option value="-1">Please select</option>');
	
	for (var i = 0, ln = data.length; i < ln; i++) {
		options.push('<option value="' + data[i].id + '">' + data[i].name + '</option>');
	}

	$ddl.html(options.join(""));
}

APP.Epics.serializeData = function () {
	
	var data = {},
		$form = $("#epic-form");
	
	data.epic = {};
	data.epic.name = $form.find("input[name='name']").val();
	data.epic.description = $form.find("textarea[name='description']").val();
	data.epic.epic_id = $form.find("select[name='epic']").val();
	data.epic.project_id = APP.Epics.projectId;
	
	if (parseInt(data.epic.epic_id) === -1) {
		delete data.epic.epic_id;
	}
	
	if (parseInt(data.epic.project_id) === -1) {
		delete data.epic.project_id;
	}	
	
	return data; 
}

APP.Epics.insertRecord = function (epicData) {
	
	$.ajax({
		type : "post",
		url : APP.baseUrl + "epics",
		data : epicData,
		dataType : "json",
		success : function (data) {
			APP.Epics.createHtml(data);
		},
		error : function () { alert("Failed to create an epic."); }
	});
}

APP.Epics.updateRecord = function (epicData) {
	
	$.ajax({
		type : "put",
		url : APP.baseUrl + "epics/" + epicData.id + ".json",
		data : epicData,
		dataType : "json",
		success : function (data) {
			APP.Epics.updateHtml(epicData);
		},
		error : function () { alert("Failed to update an epic."); }
	});	
}

APP.Epics.template = function (data) {
	
	var template = [];
	
	template.push('<div class="epic-box min" id="epic_' + data.id + '">')
	template.push('<span class="title"><i class="icon-plus"></i><i class="editEpic">E#' + data.id + '</i><span class="e-title">' + data.name + '</span></span>');
	template.push('<span class="e-desc">' + data.description + '</span>');		
	template.push('<div class="clear-both"></div>');
	template.push('<span class="epic-menu" data-epic-id="' + data.id + '">');
	template.push('<a href="JavaScript:void(0);" class="add-new-child-epic">New Epic</a>');
	template.push(' | <a href="JavaScript:void(0);" class="add-new-story">New Story</a>');
	template.push('</span>');
	template.push('<ul class="stories" id="cs_' + data.id + '">');
	template.push('</ul>');
	template.push('<ul class="child-epics" id="ce_' + data.id + '">');
	template.push('</ul>');	
	template.push('</div>');	
	
	return template.join("");	
}

APP.Epics.createHtml = function (data) {

	var epicHtml = APP.Epics.template(data);
		
	if (data.epic_id === null) {
		$("#epic-container").append(epicHtml);		
	} else {
		$("#ce_" + data.epic_id).append("<li>" + epicHtml + "</li>");
	}
}

APP.Epics.updateHtml = function (data) {

	var $epic = $("#epic_" + data.id),
		$title = $epic.find("> .title .e-title"),
		$desc = $epic.find("> .e-desc");
		oldParentId = null;
	
	if ($epic.closest(".child-epics").length > 0) {
		oldParentId = $epic.closest(".child-epics").attr("id").split("_")[1]; 
	}		
	
	// update text info	
	$title.text(data.epic.name);
	$desc.text(data.epic.description);	

	// check if there's a change in epic parent
	if (!!data.epic.epic_id) {
		if (oldParentId != data.epic.epic_id) {
			//$("#ce_" + data.epic.epic_id).append("<li/>").append($epic);		
			
			var li = $("<li/>"),
				ul = $("#ce_" + data.epic.epic_id),
				$clonedEpic = $epic.clone();
			
			$epic.remove();	
			// append new element only if epic children have been loaded already
			// otherwise it will be a duplicate since same copy will come based on content from db			
			if (ul.parent().attr("data-loaded") == "true") {
				console.log(ul.parent());
				li.append($clonedEpic);
				ul.append(li);		
			}
		}
	}
}

APP.Epics.deleteEpic = function () {
	$modal = $("#epics-modal");
	$epicBox = $("#epic_" + $modal.attr("data-epic-id"));
	console.log($epicBox);
	if (($epicBox.find("> .stories li").length > 0) || ($epicBox.find("> .child-epics li").length > 0)) {
		alert("You must delete child epics and stories first.");	
		$modal.modal("hide");	
	} else {
		if (confirm("Are you sure you want to delete this epic?")) {
			$modal.modal("hide");	
			$.ajax({
				type : "delete",
				url : APP.baseUrl + "epics/" + $modal.attr("data-epic-id") + ".json",
				success : function () {
					var e = $("#epic_" + $modal.attr("data-epic-id"));
					
					if (e.parent().is("li")) {
						e.parent().remove();
					} else {
						e.remove();
					}
					
					alert("Epic successfully deleted");
				},
				error : function () {
					alert("Failed to delete epic");
				}
			});
		}
	}
}

/**
 * Story management 
 */

APP.Epics.Story = {};

APP.Epics.Story.serializeData = function () {

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
	data.story.project_id = APP.Epics.projectId;
	data.story.epic_id = $form.find("select[name='story[epic_id]']").val();
	
	for (item in data.story) {
		if (parseInt(data.story[item]) === -1) {
			delete data.story[item];
		}
	}
	
	return data; 
}

APP.Epics.Story.insertRecord = function (storyData) {
	
	$.ajax({
		type : "post",
		url : APP.baseUrl + "stories",
		data : storyData,
		dataType : "json",
		success : function (data) {
			APP.Epics.Story.createHtml(data);
		},
		error : function () { alert("Failed to create an epic."); }
	});
}

APP.Epics.Story.createHtml = function (data) {
	
	var $ul = $("#cs_" + data.epic_id),
		li = "<li id='story_" + data.id + "'>" + data.summary + "<span class='add-story-menu' data-story-id='" + data.id + "'><i class='icon-remove'></i><i class='icon-pencil'></i></span></li>";
		
	$ul.append(li);					
}

APP.Epics.Story.appendChildren = function (epicId) {
	
	$.ajax({
		type : "get",
		url : APP.baseUrl + "epics/getChildStories.json?id=" + epicId,
		success : function (data) {
			for (var i = 0, len = data.length; i < len; i++) {
				APP.Epics.Story.createHtml(data[i]);
			}
		},
		error : function () {
			alert("Failed to fetch epic child stories");
		}
	});
}

APP.Epics.Story.populateForm = function () {

	var $modal = $("#story-modal");

	// first refresh dynamic epic list		
	$.get( APP.baseUrl + "epics.json?project_id=" + APP.Epics.projectId, function (data) {
		
		APP.Epics.refreshList(data, "story");

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
	}); 
		

}

APP.Epics.Story.updateRecord = function (storyData) {

	$.ajax({
		type : "put",
		url : APP.baseUrl + "stories/" + storyData.id + ".json",
		data : storyData,
		dataType : "json",
		success : function (data) {
			APP.Epics.Story.updateHtml(storyData);
		},
		error : function () { alert("Failed to update an epic."); }
	});	
}


APP.Epics.Story.updateHtml = function (data) {

	var $story = $("#story_" + data.id),
		$parent = $("ul#cs_" + data.story.epic_id),
		found = false; 
	
	$story.html(data.story.summary + '<span class="add-story-menu" data-story-id="' + data.id + '"><i class="icon-remove"></i><i class="icon-pencil"></i></span>');	
	
	// remove previous version from the dom
	$story.remove();
	
	// for given epic parent, find the first older (by id) story and place it before that
	$parent.find("li").each(function () {
		if (parseInt($(this).attr("id").split("_")[1]) > parseInt(data.id)) {
			
			// insert it only before first older story 
			if (!found) { 				
				$story.insertBefore($(this));
				found = true;
			}				
		}
	});	
	
	// if there is no older story append it at the end
	if (!found) {
		$parent.append($story);		
	}
}

APP.Epics.Story.remove = function ($icon) {
	
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
	APP.Epics.init();
});