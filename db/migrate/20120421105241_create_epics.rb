class CreateEpics < ActiveRecord::Migration
  def change
    create_table :epics do |t|
      t.string :name
      t.string :description
      t.references :epic
      t.references :project

      t.timestamps
    end
    add_index :epics, :epic_id
    add_index :epics, :project_id
  end
end
