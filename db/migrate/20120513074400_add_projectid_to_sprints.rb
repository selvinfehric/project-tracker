class AddProjectidToSprints < ActiveRecord::Migration
  def change
    add_column :sprints, :project_id, :integer
  end
end
