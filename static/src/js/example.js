openerp.example = function (instance) {

    var _t = instance.web._t;
    var QWeb = instance.web.qweb;

    instance.example.Action = instance.web.Widget.extend ({
        template: 'example.test_template',

        start: function () {
            var body = this.$el.parents ('body');

            if (!window.google) {
                window.ginit = this.on_loaded;
                jQuery.getScript ('https://maps.googleapis.com/maps/api/js?v=3.5&sensor=false&callback=ginit');
            } else {
                this.on_loaded ();
            }
        },

        on_loaded: function () {
            var div = this.$el;

            var center = new google.maps.LatLng (45.651248, 13.780332);
            var map = new google.maps.Map (document.getElementById('gmap'), {
                zoom: 14,
                center: center,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            var marker = new google.maps.Marker({
                position: center,
                map: map,
                title: _t("Trieste"),
            });

            var url = instance.session.url ('/example/json_url', {});
            instance.session.rpc (url).done (function (result) {
                jQuery.each (result, function (i, item) {
                    div.find ('#tests').append ('<div>' + item.name + '</div>');
                });
            }).fail (function (result) {
                console.log ("ERROR: " + result.message);
            });

        },

    });

    instance.example.action_func = function (parent, action) {
        console.log ("Executed the action", action);
    };

    instance.web.client_actions.add ('example.action', 'instance.example.Action');
    instance.web.client_actions.add ('example.action_func', 'instance.example.action_func');

    instance.web.SearchView = instance.web.SearchView.extend ({
        init: function () {
            this._super.apply (this, arguments);
            this.on ('search_data', this, function () {
                console.log ('Hello search');
            });
        }
    });

    instance.web.ListView.include ({
        select_record: function (index, view) {
            console.log ('Selected record, model: ' + this.model + ' index: ' + index);
            this._super.apply (this, arguments);
        }
    });

    instance.web.FormView.include ({
        load_record: function (record) {
            console.log ('Loaded record, model: ' + this.model + ' index: ' + record.id);
            if (this.model == 'example.test' && record.id) {
                instance.example.test_hello ();
            }
            this._super.apply (this, arguments);
        }
    });

    instance.web.Login = instance.web.Login.extend ({
        start: function () {
            console.log ('Hello login');
            return this._super.apply (this, arguments);
        }
    });

    instance.web.list.Column = instance.web.list.Column.extend ({
        _format: function (row_data, options) {
            return '<span>' + this._super.apply (this, arguments) + '</span>';
        }
    });

    instance.example.test_hello = function () {

        instance.session.rpc ('/example/json_url').done (function (result) {
            var div = jQuery("#test-section");

            div.empty ();
            jQuery.each (result, function (i, item) {
               var el = jQuery('<div><a href="#">' + item.name + '</a></div>');
               div.append (el);
            });

        }).fail (function (result) {
            console.log ("ERROR: " + result.message);
        });

        return false;
    };

    instance.example.account_invoice_toggle_column = function (column) {
        var index = jQuery("table th[data-id=" + column + "]").toggle ().index ();

        jQuery("table.oe_list_content:visible td:nth-child(" + (index + 1) + ")").toggle ();
    }

    instance.example.account_invoice_hello = function () {

        var Users = new instance.web.Model ('res.users');
        var Windows = new instance.web.Model ('ir.actions.act_window');
        var Menus = new instance.web.Model ('ir.ui.menu');

        var users_d = Users.query ().all ();
        var win_d = Windows.query ().filter ([['res_model', '=', 'res.users'], ['name', '=', 'Users']]).first ();

        jQuery.when (users_d, win_d).done (function (users, win, menu) {
            var div = jQuery("#test-tab");

            jQuery.each (users, function (i, user) {
               var el = jQuery('<div><a>' + user.login + '</a></div>');


               el.click (function () {
                   openerp.webclient.action_manager.do_action ({
                       type: 'ir.actions.act_window',
                       res_model: 'res.users',
                       res_id: user.id,
                       views: [[false, 'form']],
                       target: 'new',
                       context: {},
                   });
               });

               div.append (el);

            });
        }).fail (function (result) {
            console.log ("ERROR: " + result.message);
        });

        return false;
    }

};

