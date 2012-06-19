class LoginController < ActionController::Base
 
  def index
    @username="admin"
    @password=Digest::MD5.hexdigest("admin")
    
    if(session[:user])
      redirect_to '/projects'
    end
    
    if(params[:login])
       @user=getUser(params)
       if(@user)
          session[:user] = @user
          redirect_to '/projects'
       else
         flash[:wrong_login]="Wrong username or password. Please try again!"
       end
    end
  end
  
  def getUser params   
    User.find_by_username_and_password(params[:username],Digest::MD5.hexdigest(params[:password]))
  end
    # if(params[:username]==@username && Digest::MD5.hexdigest(params[:password])==@password)
 
  def logout
    session[:user]=nil
    redirect_to '/'
  end
end
