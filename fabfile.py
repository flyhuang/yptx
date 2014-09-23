"""
Tech Talk Jekyll blog auto deployment tool.
"""
from fabric.api import *
from fabric.contrib.files import exists
from fabric.colors import green, red

####################################################################
# 			     Tech Talk  Auto Deployment                       #
####################################################################

# Internal variables
APP_HOME = "~/apps"
DEPLOY_USER = "deploy"
DEPLOY_PASSWORD = "deploy"
DEPLOY_HOST = "121.40.182.189"
TRAVIS_SSH_KEY = "~/.ssh/id_rsa"

def setup():
    """Prepare to login to production server."""
    env.host_string = DEPLOY_HOST
    env.user = DEPLOY_USER
    env.password = DEPLOY_PASSWORD
    env.key_filename = TRAVIS_SSH_KEY
    env.port = 22
    print(red("Login production server succeed!!!"))

def deploy():
    """ Ready to deploy Jekyll blog """
    if not exists(APP_HOME):
        run("mkdir -p %s" % APP_HOME)
    local("tar -cvf  yptx.tar --exclude='*.py' *")
    put('yptx.tar', APP_HOME)

def restart():
    run('cd %s && mkdir -p yptx' % APP_HOME)
    run('tar -xvf %s/yptx.tar -C %s/yptx' % (APP_HOME, APP_HOME))
    run('cd %s/yptx && npm --registry=http://r.cnpmjs.org --cache=$HOME/.npm/.cache/cnpm --disturl=http://cnpmjs.org/dist install' % APP_HOME)
    run('sudo stop foreman')
    run('sudo start foreman')
    print(red("Deploy production Server Succeed!!!"))

def clean():
    run('cd %s && rm -rf yptx.tar' % APP_HOME)
    print(red("Do housekeeping in production Server Succeed!!!")) 