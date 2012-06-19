class CreateStories < ActiveRecord::Migration
  def change
    create_table :stories do |t|
      t.text :summary
      t.text :details
      t.integer :points
      t.datetime :date_created
      t.datetime :date_modified
      t.datetime :date_completed
      t.references :status
      t.references :story_type
      t.references :sprint
      t.references :user
      t.references :project
      t.references :epic

      t.timestamps
    end
    add_index :stories, :status_id
    add_index :stories, :story_type_id
    add_index :stories, :sprint_id
    add_index :stories, :user_id
    add_index :stories, :project_id
    add_index :stories, :epic_id
  end
end
