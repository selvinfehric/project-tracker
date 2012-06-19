class StoriesController < ApplicationController
  
   before_filter :set_session
  
  def set_session
    @project_id = session[:project].id
  end
  
  # GET /stories
  # GET /stories.json
  def index
    @stories = Story.find_all_by_project_id(@project_id)
    @current_submenu = "backlog"
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @stories }
    end
  end

  # GET /stories/1
  # GET /stories/1.json
  def show
    @story = Story.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @story }
    end
  end

  # GET /stories/new
  # GET /stories/new.json
  def new
    @story = Story.new
    @statuses = Status.all
    @story_types = StoryType.all
    @sprints = Sprint.all
    @users = User.all
    @epics = Epic.all
    @story.project_id = @project_id #ovdje ide session.project_id
    
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @story }
    end
  end

  # GET /stories/1/edit
  def edit
    @story = Story.find(params[:id])
    # todo
    @statuses = Status.all
    @story_types = StoryType.all
    @sprints = Sprint.all
    @users = User.all
    @epics = Epic.all
    
  end

  # POST /stories
  # POST /stories.json
  def create
    @story = Story.new(params[:story])
    @story.project_id = @project_id #ovdje ide session.project_id
    @story.date_created=DateTime.now
    if (@story.status_id == 4)
      @story.date_completed=DateTime.now
    else
      @story.date_completed=nil
    end
    respond_to do |format|
      if @story.save
        format.html { redirect_to @story, notice: 'Story was successfully created.' }
        format.json { render json: @story, status: :created, location: @story }
      else
        format.html { render action: "new" }
        format.json { render json: @story.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /stories/1
  # PUT /stories/1.json
  def update
    @story = Story.find(params[:id])

    respond_to do |format|
      if @story.update_attributes(params[:story])
        @story.date_modified=DateTime.now
        if (@story.status_id == 4)
          @story.date_completed=DateTime.now
        else
          @story.date_completed=nil
        end
        @story.save
        format.html { redirect_to @story, notice: 'Story was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { rendrer json: @story.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /stories/1
  # DELETE /stories/1.json
  def destroy
    @story = Story.find(params[:id])
    @story.destroy

    respond_to do |format|
      format.html { redirect_to stories_url }
      format.json { head :no_content }
    end
  end
end
