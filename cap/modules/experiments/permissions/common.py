# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
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


from cap.config import CAP_COLLAB_EGROUPS, SUPERUSER_EGROUPS


def get_collaboration_group_needs(collaboration_name=None):
    if collaboration_name in CAP_COLLAB_EGROUPS:
        return CAP_COLLAB_EGROUPS[collaboration_name]
    else:
        return []


def get_superuser_needs():
    if SUPERUSER_EGROUPS:
        return SUPERUSER_EGROUPS
    else:
        return []

superuser_needs = set([g for g in
                       get_superuser_needs()])
