# -*- coding: utf-8 -*-

import base64

import openerp
import openerp.addons.web.http as http
from openerp.addons.web.http import request


class ExampleController (http.Controller):

    _cp_path = '/example'

    @http.route ('/example/http_url', type='http')
    def http_url (self, **kwargs):
        User = request.registry.get ('example.test')

        content = 'hello, world'

        return request.make_response (content, headers=[('Content-Type', 'text/plain')])

    @http.route ('/example/json_url', type='json')
    def json_url (self, **kwargs):
        Test = request.registry.get ('example.test')

        tests = Test.read (request.cr, request.uid, Test.search (request.cr, request.uid, []))

        return tests

