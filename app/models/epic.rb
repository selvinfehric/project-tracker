class Epic < ActiveRecord::Base
  belongs_to :epic
  belongs_to :project
  has_many :stories
  has_many :epics
end
