RiaTracker::Application.routes.draw do
  
  
  match "/login" => "login#index"
  
  match '/login/:action' => 'login#:action'
  
  match "/epics/getChildEpics" => "epics#getChildEpics"
  match "/epics/getChildStories" => "epics#getChildStories"
  match "/sprints/scrumboard/:id" => "sprints#scrumboard"
  
  resources :stories do
    resources :story_types
    resources :statuses
  end

  resources :statuses
  
  resources :story_types

  resources :epics

  resources :projects

  resources :users

  resources :roles

  resources :sprints
  
  match '/users/:id/:action(.:format)' => 'users#:action'
   
  match '/users/:id/changePassword(.:format)' => 'users#changePassword'
      
  match "/projects/adduser/:id" => "projects#adduser"
  
  match "/projects/removeuser/:id" => "projects#removeuser"
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'login#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  
end
