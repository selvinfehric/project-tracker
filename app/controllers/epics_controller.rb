class EpicsController < ApplicationController
  before_filter :set_session
  
  def set_session
    @project_id = (session[:project]  == nil) ? nil : session[:project].id
  end
    
  # GET /epics renders epics view
  # GET /epics.json returns all epics as a json
  # GET /epics.json?project_id=x returns a list of epics filtered by project_id (json)
 
  def index
    @current_submenu = "epics"
    if params[:project_id] != nil
        @epics = Epic.find_all_by_project_id(params[:project_id])
    else
      @epics = Epic.all  
    end    
    
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @epics }
    end
  end

  # GET /epics/1
  # GET /epics/1.json
  def show
    @epic = Epic.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @epic }
    end
  end

  # GET /epics/new
  # GET /epics/new.json
  def new
    @epic = Epic.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @epic }
    end
  end

  # GET /epics/1/edit
  def edit
    @epic = Epic.find(params[:id])
  end

  # POST /epics
  # POST /epics.json
  def create
    @epic = Epic.new(params[:epic])
    respond_to do |format|
      if @epic.save
        format.html { redirect_to @epic, notice: 'Epic was successfully created.' }
        format.json { render json: @epic, status: :created, location: @epic }
      else
        format.html { render action: "new" }
        format.json { render json: @epic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /epics/1
  # PUT /epics/1.json
  def update
    @epic = Epic.find(params[:id])

    respond_to do |format|
      if @epic.update_attributes(params[:epic])
        format.html { redirect_to @epic, notice: 'Epic was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @epic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /epics/1
  # DELETE /epics/1.json
  def destroy
    @epic = Epic.find(params[:id])
    @epic.destroy

    respond_to do |format|
      format.html { redirect_to epics_url }
      format.json { head :no_content }
    end
  end
  
  # GET /epics
  # GET /epics.json  
  def getChildEpics
    @epics = Epic.find_all_by_epic_id_and_project_id(params[:id], @project_id)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @epics }
    end    
  end
  
  # GET /epics
  # GET /epics.json  
  def getChildStories
    @stories = Story.find_all_by_epic_id(params[:id])

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @stories }
    end    
  end
  
  #def addNew
  #  @epic = Epic.new(params[:epic])
  #  if @epic.save
  #    render :text => "success"
  #  else
  #    render :text => "error"
  #  end
  #end
  
end
