class ChangeDateTypes < ActiveRecord::Migration
  def up
    change_column :users, :date_created, :datetime
    change_column :stories, :date_created, :datetime
    change_column :stories, :date_modified, :datetime
    change_column :stories, :date_completed, :datetime
  end

  def down
    change_column :users, :date_created, :date
    change_column :stories, :date_created, :date
    change_column :stories, :date_modified, :date
    change_column :stories, :date_completed, :date
  end
end
