class Sprint < ActiveRecord::Base
    has_many :stories
    belongs_to :project, :class_name => Project
end
