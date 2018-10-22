<template>
    <div class="container">
        <div class="tab-pane fade show active">
            <div class="row">
                <div class="col-md-12">
                    <h3>New Invoice</h3>
                    <form @submit.prevent="onSubmit">
                        <div class="form-group">
                            <label for="">Invoice name</label>
                            <input type="text" class="form-control" placeholder="eg FV/1222/10/2044" v-model="invoice.name" />
                        </div>
                        <div class="form-group">
                            <label for="">Price:</label> <span>{{invoice.total_price}} pln</span>
                        </div>

                        <hr/>
                        <button type="button" class="btn btn-primary" data-toogle="modal" data-target="#transactionModal">Add position</button>

                        <div class="modal fade" id="transactionModal" tabindex="-1" role="dialog" aria-labelledby="transactionModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Add</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="fom-group">
                                            <label for="">Name</label>
                                            <input type="text" id="txn_name_modal" class="form-control" />
                                        </div>
                                        <div class="fom-group">
                                            <label for="">Quantity</label>
                                            <input type="text" id="txn_quantity_modal" class="form-control" />
                                        </div>
                                        <div class="form-group">
                                            <label for="">Price net</label>
                                            <input type="text" id="txn_price_net_modal" class="form-control" />
                                        </div>
                                        <div class="fom-group">
                                            <label for="">VAT</label>
                                            <input type="text" id="txn_vat_modal" class="form-control" />
                                        </div>
                                        <div class="fom-group">
                                            <label for="">Value net</label>
                                            <input type="text" id="txn_value_net_modal" class="form-control" />
                                        </div>
                                        <div class="fom-group">
                                            <label for="">Value gross</label>
                                            <input type="text" id="txn_value_gross_modal" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal" data-target="#transactionModal">X</button>
                                        <button type="button" class="btn btn-primary" data-dismiss="modal" data-target="#transactionModal" v-on:click="saveTransaction()">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
