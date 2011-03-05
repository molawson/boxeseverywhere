require "rubygems"
require "sinatra"
require "lib/models"

use Rack::Auth::Basic do |username, password|
  [username, password] == [ENV['ADMIN_USERNAME'], ENV['ADMIN_PASSWORD']]
end

get '/' do
  @title = "Your Stuff"
  @plus = '/items/new'
  @search = params[:search]
  if @search
    @items = Item.all(:conditions => ["name ILIKE ?", "%#{@search}%"], :order => [:name.asc])
  else
    @items = Item.all(:order => [:name.asc])
  end
  erb :index
end

get '/items/new' do
  @title = "Your Stuff"
  @items = Item.all(:order => [:id.desc])
  erb :new
end

post '/items' do
  if Item.create(params[:item])
    redirect '/items/new'
  end
end

get '/boxes/:box' do
  @title = "<span class='box_number'>#{params[:box]}</span> Box Contents"
  @items = Item.all(:box => params[:box])
  erb :box
end