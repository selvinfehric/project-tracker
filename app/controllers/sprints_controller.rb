class SprintsController < ApplicationController
  
  before_filter :set_session
  
  def set_session
    @project_id = session[:project].id
  end
  
  # GET /sprints
  # GET /sprints.json
  def index
    @sprints = Sprint.find_all_by_project_id(@project_id)
    @current_submenu = "sprints"
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @sprints }
    end
  end

  # GET /sprints/1
  # GET /sprints/1.json
  def show
    @sprint = Sprint.find(params[:id])
    @current_subsubmenu = "show"
    @current_submenu = "sprints"
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @sprint }
    end
  end

  # GET /sprints/new
  # GET /sprints/new.json
  def new
    @sprint = Sprint.new
    @sprint.project_id = @project_id #ovdje ide session.project_id
    
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @sprint }
    end
  end

  # GET /sprints/1/edit
  def edit
    @sprint = Sprint.find(params[:id])
    @current_subsubmenu = "update"
    @current_submenu = "sprints"
  end

  # POST /sprints
  # POST /sprints.json
  def create
    @sprint = Sprint.new(params[:sprint])
    @sprint.project_id = @project_id #ovdje ide session.project_id
   
    respond_to do |format|
      if @sprint.save
        format.html { redirect_to @sprint, notice: 'Sprint was successfully created.' }
        format.json { render json: @sprint, status: :created, location: @sprint }
      else
        format.html { render action: "new" }
        format.json { render json: @sprint.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /sprints/1
  # PUT /sprints/1.json
  def update
    @sprint = Sprint.find(params[:id])
    respond_to do |format|
      if @sprint.update_attributes(params[:sprint])
        format.html { redirect_to @sprint, notice: 'Sprint was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @sprint.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sprints/1
  # DELETE /sprints/1.json
  def destroy
    @sprint = Sprint.find(params[:id])
    @sprint.destroy

    respond_to do |format|
      format.html { redirect_to sprints_url }
      format.json { head :no_content }
    end
  end
  
  # GET /sprints/scrumboard/1
  # GET /sprints/scrumboard/1.json
  def scrumboard
    @sprint = Sprint.find(params[:id])
    @current_submenu = "sprints"
    @current_subsubmenu = "scrumboard"
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @sprint }
    end
  end  
  
end
