# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120519115130) do

  create_table "epics", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "epic_id"
    t.integer  "project_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "epics", ["epic_id"], :name => "index_epics_on_epic_id"
  add_index "epics", ["project_id"], :name => "index_epics_on_project_id"

  create_table "projects", :force => true do |t|
    t.string   "name"
    t.datetime "date_created"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "projects_users", :id => false, :force => true do |t|
    t.integer "project_id"
    t.integer "user_id"
  end

  add_index "projects_users", ["project_id", "user_id"], :name => "index_projects_users_on_project_id_and_user_id"

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "roles_users", :id => false, :force => true do |t|
    t.integer "roles_id"
    t.integer "user_id"
  end

  add_index "roles_users", ["roles_id", "user_id"], :name => "index_roles_users_on_roles_id_and_user_id"

  create_table "sprints", :force => true do |t|
    t.string   "name"
    t.datetime "start"
    t.datetime "end"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "project_id"
  end

  create_table "statuses", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "stories", :force => true do |t|
    t.text     "summary"
    t.text     "details"
    t.integer  "points"
    t.datetime "date_created"
    t.datetime "date_modified"
    t.datetime "date_completed"
    t.integer  "status_id"
    t.integer  "story_type_id"
    t.integer  "sprint_id"
    t.integer  "user_id"
    t.integer  "project_id"
    t.integer  "epic_id"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  add_index "stories", ["epic_id"], :name => "index_stories_on_epic_id"
  add_index "stories", ["project_id"], :name => "index_stories_on_project_id"
  add_index "stories", ["sprint_id"], :name => "index_stories_on_sprint_id"
  add_index "stories", ["status_id"], :name => "index_stories_on_status_id"
  add_index "stories", ["story_type_id"], :name => "index_stories_on_story_type_id"
  add_index "stories", ["user_id"], :name => "index_stories_on_user_id"

  create_table "story_types", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "password"
    t.datetime "date_created"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.boolean  "is_admin"
  end

end
