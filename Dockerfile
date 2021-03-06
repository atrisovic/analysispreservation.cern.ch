# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017, 2018 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

# Use CentOS7:
FROM centos:7

# Install CERN Open Data Portal web node pre-requisites:
RUN yum update -y && \
    yum install -y \
        curl \
        git \
        rlwrap \
        screen \
        vim \
        emacs-nox && \
    yum install -y \
        epel-release && \
    yum groupinstall -y "Development Tools" && \
    yum install -y \
        libffi-devel \
        libxml2-devel \
        libxslt-devel \
        npm \
        python-devel \
        python-pip \
        openldap-devel \
        gpgme-devel \
        libassuan-devel \
        btrfs-progs-devel \
        device-mapper-devel \
        ostree-devel \
        go-md2man

# Install xrootd
# RUN rpm -Uvh http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm

RUN yum install -y xrootd xrootd-server xrootd-client xrootd-client-devel xrootd-python

# Print xrootd version
RUN xrootd -v

ENV GO_VERSION=1.9.1 \
    GOROOT=/goroot \
    GOPATH=/gopath 

ENV PATH $PATH:$GOROOT/bin:$GOPATH/bin

RUN yum update -y && \
    yum install -y -q curl build-essential ca-certificates git mercurial bzr && \
    mkdir /goroot && curl https://storage.googleapis.com/golang/go${GO_VERSION}.linux-amd64.tar.gz | tar xvzf - -C /goroot --strip-components=1 && \
    mkdir /gopath 

# Clean after ourselves:
RUN yum clean -y all

RUN git clone https://github.com/projectatomic/skopeo $GOPATH/src/github.com/projectatomic/skopeo

RUN cd $GOPATH/src/github.com/projectatomic/skopeo && make binary-local && make docs && make install

ENV APP_INSTANCE_PATH=/usr/local/var/cap-instance

RUN pip install --upgrade pip setuptools wheel

# Install python modules and deps
WORKDIR /code
ADD setup.py setup.py
ADD cap/version.py cap/version.py

# Debug off by default
ARG DEBUG=False
ENV DEBUG=${DEBUG}

# Add CAP sources to `code` and work there:
WORKDIR /code
ADD . /code

RUN pip install -r requirements-local-forks.txt
RUN if [ "$DEBUG" != "True" ]; then pip install -r requirements.txt; fi;

# Install Python packages needed for development
RUN if [ "$DEBUG" = "True" ]; then pip install -r requirements-devel.txt; fi;

RUN pip install .

RUN adduser --uid 1000 cap --gid 0 && \
    chown -R cap:root /code

ARG APP_GITHUB_OAUTH_ACCESS_TOKEN
ENV APP_GITHUB_OAUTH_ACCESS_TOKEN=${APP_GITHUB_OAUTH_ACCESS_TOKEN}
ARG APP_GITLAB_OAUTH_ACCESS_TOKEN
ENV APP_GITLAB_OAUTH_ACCESS_TOKEN=${APP_GITLAB_OAUTH_ACCESS_TOKEN}

#RUN bash /code/scripts/build-assets.sh
RUN mkdir -p ${APP_INSTANCE_PATH}
RUN chown -R cap:root /usr/local/var/cap-instance

USER 1000

CMD ["cap", "run", "-h", "0.0.0.0"]
