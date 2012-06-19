class ProjectsController < ApplicationController
  # GET /projects
  # GET /projects.json
  
 
  def index
    @projects = Project.all
    @current_menu = "projects"
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @projects }
    end
  end

  # GET /projects/1
  # GET /projects/1.json
  def show
    @project = Project.find(params[:id])
    @current_submenu = "summary"
    session[:project] = @project
      number_of_streams=10
      streams_created=Story.find(:all, :conditions => ["date_created IS NOT NULL AND project_id=?", @project.id], :order =>"date_created DESC", :limit => number_of_streams)
      streams_modified=Story.find(:all, :conditions => ["date_modified IS NOT NULL AND project_id=?", @project.id], :order =>"date_modified DESC", :limit => number_of_streams)
      streams_completed=Story.find(:all, :conditions => ["date_completed IS NOT NULL AND project_id=?", @project.id], :order =>"date_completed DESC", :limit => number_of_streams)
      @streams = []
      i=0;
      for sc in streams_created
        item = {}
        item['type'] = "created";
        item['date'] = sc.date_created;
        item['item'] = sc;
        @streams[i] = item;
        i=i+1;
      end
      for sm in streams_modified
        item = {}
        item['type'] = "modified";
        item['date'] = sm.date_modified;
        item['item'] = sm;
        @streams[i] = item;
        i=i+1;
      end
      for scom in streams_completed
        item = {}
        item['type'] = "completed";
        item['date'] = scom.date_completed;
        item['item'] = scom;
        @streams[i] = item;
        i=i+1;
      end
      @streams.sort!{ |a,b| b['date'] <=> a['date']}
      @streams=@streams[0,number_of_streams]
      
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @project }
    end
  end

  # GET /projects/new
  # GET /projects/new.json
  def new
    @project = Project.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @project }
    end
  end

  # GET /projects/1/edit
  def edit
    @project = Project.find(params[:id])
    @users = User.all
    @current_submenu = "edit"
  end

  # POST /projects
  # POST /projects.json
  def create
    @project = Project.new(params[:project])
    @project.date_created=DateTime.now
    respond_to do |format|
      if @project.save
        format.html { redirect_to @project, notice: 'Project was successfully created.' }
        format.json { render json: @project, status: :created, location: @project }
      else
        format.html { render action: "new" }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /projects/1
  # PUT /projects/1.json
  def update
    @project = Project.find(params[:id])

    respond_to do |format|
      if @project.update_attributes(params[:project])
        format.html { redirect_to @project, notice: 'Project was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /projects/1
  # DELETE /projects/1.json
  def destroy
    @project = Project.find(params[:id])
    @project.destroy

    respond_to do |format|
      format.html { redirect_to projects_url }
      format.json { head :no_content }
    end
  end
  
  def adduser 
    @user = User.find(params[:id])
    session[:project].users << @user
    session[:project].save
    redirect_to edit_project_path(session[:project])
  end
  
   def removeuser 
    @user = User.find(params[:id])
    session[:project].users.delete(@user)
    session[:project].save
    redirect_to edit_project_path(session[:project])
  end
 
end
