require "extensions/views"
require "slim"

activate :views
activate :directory_indexes
activate :autoprefixer

set :relative_links, true
set :css_dir, "assets/stylesheets"
set :js_dir, "assets/javascripts"
set :images_dir, "assets/images"
set :fonts_dir, "assets/fonts"
set :layout, "layouts/application"
set :haml, ugly: true

configure :development do
 activate :livereload
end

configure :build do
  # Relative assets needed to deploy to Github Pages
  activate :relative_assets
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.deploy_method = :git
end

helpers do
  def nav_link(link_text, page_url, options = {})
    options[:class] ||= ""
    if current_page.url.length > 1
      current_url = current_page.url.chop
    else
      current_url = current_page.url
    end
    options[:class] << " active" if page_url == current_url
    link_to(link_text, page_url, options)
  end

  def repo_url(path)
    "https://github.com/diesel-rs/diesel/tree/v1.4.4/#{path}"
  end

  def example_file(path)
    repo_url("examples/#{path}")
  end

  def getting_started_demo_file(step, file)
    example_file("postgres/getting_started_step_#{step}/#{file}")
  end
end
