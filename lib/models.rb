require "rubygems"
require "data_mapper"

# DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, ENV['DATABASE_URL'])

class Item
  include DataMapper::Resource
  
  property :id,   Serial
  property :name, String
  property :box,  Integer
end

DataMapper.auto_upgrade!
