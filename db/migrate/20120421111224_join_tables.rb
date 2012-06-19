class JoinTables < ActiveRecord::Migration
  def up
    create_table :projects_users, :id => false do |t|
      t.references :project
      t.references :user
    end
    add_index :projects_users, [:project_id,:user_id]
    
    create_table :roles_users, :id => false do |t|
      t.references :roles
      t.references :user
    end
    add_index :roles_users, [:roles_id,:user_id]
    
  end

  def down
    drop_table :projects_users
    drop_table :roles_users
  end
end
