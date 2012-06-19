class Story < ActiveRecord::Base
  belongs_to :status
  belongs_to :story_type
  belongs_to :sprint
  belongs_to :user
  belongs_to :project
  belongs_to :epic
end
