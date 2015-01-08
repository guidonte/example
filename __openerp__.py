{
    'name': "Example",
    'description': "Basic examples for OpenERP modules",
    'category': 'Hidden',
    'depends': ['web', 'account'],
    'js': ['static/src/js/example.js'],
    'css': ['static/src/css/example.css'],
    'qweb': [
        'static/src/xml/example.xml',
        'static/src/xml/base.xml',
    ],
    'data': [
        'security/example_security.xml',
        'security/ir.model.access.csv',
        'example_demo.xml',
        'example_view.xml',
        'account_invoice_view.xml',
    ],
    'installable': True,
    'auto_install': False,
}

