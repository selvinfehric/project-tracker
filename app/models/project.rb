class Project < ActiveRecord::Base
    has_many :stories
    has_many :epics
    has_and_belongs_to_many :users
end
