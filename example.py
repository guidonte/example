# -*- coding: utf-8 -*-

from openerp.osv import osv
from openerp.osv import fields

import openerp.addons.decimal_precision as dp

import datetime


class account_invoice (osv.osv):

    _inherit = "account.invoice"
    _columns = {
        'test_field': fields.char ('Test Field', size=64, readonly=False),
    }

account_invoice ()


class example_test (osv.osv):

    _name = "example.test"
    _description = 'Example Test'
    _order = "id"
    _columns = {
        'name': fields.char ('Name', size=64, select=True, readonly=False),
        'date': fields.date ('Date'),
        'lines': fields.one2many ('example.test.line', 'test_id', 'Test Lines'),
        'lines_new_window': fields.one2many ('example.test.line', 'test_id', 'Test Lines', readonly=True),
        'objects': fields.many2many ('example.obj', 'example_obj_test', 'test_id', 'obj_id', 'Objects'),
    }
    _defaults = {
        'name': lambda self, cr, uid, c: 'test name',
        'date': lambda self, cr, uid, ctx: ctx.get ('date', fields.date.context_today (self,cr,uid,context=ctx)),
    }
    _sql_constraints = [
    ]


class example_test_line (osv.osv):

    def _total_amount (self, cr, uid, ids, prop, unknow_none, unknow_dict):
        res = {}
        for line in self.browse (cr, uid, ids):
            res[line.id] = line.unit_price * line.quantity

        return res

    _name = "example.test.line"
    _description = "Example Test Line"
    _order = "id"
    _columns = {
        'test_id': fields.many2one ('example.test', 'Test Object reference', required=True, ondelete='cascade', select=True),
        'description': fields.text ('Description', required=True),
        'quantity': fields.integer ('Quantity'),
        'unit_price': fields.float ('Unit Price', digits_compute= dp.get_precision('Product Price')),
        'total_amount': fields.function (_total_amount, string='Total Amount', type="float",
            digits_compute= dp.get_precision('Product Price'), store=True),
        'notes': fields.one2many ('example.test.note', 'line_id', 'Test Notes', readonly=True),
    }


class example_test_note (osv.osv):

    _name = "example.test.note"
    _description = "Example Test Note"
    _order = "id"
    _columns = {
        'line_id': fields.many2one ('example.test.line', 'Test Line reference', required=True, ondelete='cascade', select=True),
        'text': fields.text ('Text', required=True),
    }


class example_obj (osv.osv):

    _name = "example.obj"
    _description = 'Example Object'
    _order = "id"
    _columns = {
        'name': fields.char ('Name', size=64, select=True, readonly=False),
        'tests': fields.many2many ('example.test', 'example_obj_test', 'obj_id', 'test_id', 'Objects'),
    }
