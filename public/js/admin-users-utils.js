                $(document).ready(function() {
                $('#rankTblload').DataTable({
                  iDisplayLength: 8,
                  aLengthMenu: [[8, 16, 24, -1], [8, 16, 24, "All"]],
                  language:{
                    processing: "Processing...",
                    search: "Search:",
                    lengthMenu: "_MENU_ users",
                    info: "_START_ to _END_ of _TOTAL_ users ",
                    infoEmpty: "0 to 0 of 0 users",
                    infoFiltered: "(filtered from _MAX_ total users)",
                    infoPostFix: "",
                    loadingRecords: "Loading...",
                    zeroRecords: "No matching users found",
                    emptyTable: "No data available",
                    paginate: {
                    first: "First",
                    previous: "<",
                    next: ">",
                    last: "Last",
                    //search: "_INPUT_",
                    searchPlaceholder: "Search..."
                    },
                    aria: {
                    sortAscending: ": activate to sort column ascending",
                    sortDescending: ": activate to sort column descending"
                    }
                  }
                  });

                $(".labnameedit").on('change', function () {
                    console.log("changing lab " + $(this).val());
                    console.debug($(this).parent());
                    $(this).parent().submit();
                  });

                });