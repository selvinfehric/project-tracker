class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter :login_required
  
  def login_required
    if session[:user]
      if (params[:controller] == "users")
        @current_menu = "users"
      else
        @current_menu = "projects"  
      end
      if (params[:controller] == "sprints" && params[:id])
        @sprints_submenu = true
      else 
         @sprints_submenu = false
      end
      return true
    end
    flash[:wrong_login]='Please login to continue'
    redirect_to "/"
    return false 
  end
end
