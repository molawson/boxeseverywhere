require "rubygems"
require "sinatra"
require "sinatra/content_for"
require "lib/models"

use Rack::Auth::Basic do |username, password|
  [username, password] == [ENV['ADMIN_USERNAME'], ENV['ADMIN_PASSWORD']]
end

helpers do
  def partial(template, *args)
    template_array = template.to_s.split('/')
    template = template_array[0..-2].join('/') + "/_#{template_array[-1]}"
    options = args.last.is_a?(Hash) ? args.pop : {}
    options.merge!(:layout => false)    
    erb(:"#{template}", options)
  end
end

get '/' do
  @title = "Your Stuff"
  @items = Item.all(:order => [:name.asc])
  erb :index, :layout => !request.xhr?
end

get '/items/new' do
  @title = "Your Stuff"
  @items = Item.all(:order => [:id.desc])
  erb :new, :layout => !request.xhr?
end

post '/items' do
  if Item.create(params[:item])
    if request.xhr?
      @items = Item.all(:order => [:id.desc])
      erb :_items_list, :layout => false
    else
      redirect '/items/new'
    end
  end
end

get '/boxes' do
  @title = "Boxes"
  @boxes = Item.all(:fields => [:box], :unique => true, :order => [:box.asc])
  erb :boxes, :layout => !request.xhr?
end

get '/boxes/:box' do
  @test = request
  @title = "<span class='box_number'>#{params[:box]}</span> Box Contents"
  @items = Item.all(:box => params[:box])
  erb :box, :layout => !request.xhr?
end

post '/search' do
  @items = Item.all(:conditions => ["name ILIKE ?", "%#{params[:search]}%"], :order => [:name.asc])
  erb :_search_results, :layout => !request.xhr?
end