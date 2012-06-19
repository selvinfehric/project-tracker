class ChangeDateTypes2 < ActiveRecord::Migration
  def up
    change_column :projects, :date_created, :datetime
    change_column :sprints, :start, :datetime
    change_column :sprints, :end, :datetime
  end

  def down
    change_column :projects, :date_created, :date
    change_column :sprints, :start, :date
    change_column :sprints, :end, :date
  end
end
