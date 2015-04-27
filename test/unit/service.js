var Radio = require('backbone.radio');
var Service = require('../../src/marionette-service.js');


describe('Marionette radio helpers', function() {

  describe('when creating a Marionette.Service', function() {

    beforeEach(function() {
      this.clickStub1 = global.sinon.stub();
      this.clickStub2 = global.sinon.stub();
      this.clickStub3 = global.sinon.stub();
      this.Service = Service.extend({
        radioEvents: {
          'foo bar' : this.clickStub1
        },
        radioCommands: {
          'bar foo' : this.clickStub2
        },
        radioRequests: {
          'foo bar' : 'baz'
        },

        baz: this.clickStub3,

      });
      this.service = new this.Service();
      Radio.channel('foo').trigger('bar');
      Radio.channel('foo').request('bar');
      Radio.channel('bar').command('foo');

    });

    it('should support listening to radio events declaratively', function() {
      expect(this.clickStub1).to.have.been.calledOnce;
    });

    it('should support complying to radio commands declaratively', function() {
      expect(this.clickStub2).to.have.been.calledOnce;
    });

    it('should support replying to radio requests declaratively', function() {
      expect(this.clickStub3).to.have.been.calledOnce;
    });


    it('should unsubscribe events when the object is destroyed', function() {
      this.service.destroy();
      Radio.channel('foo').trigger('bar');
      expect(this.clickStub1).to.have.been.calledOnce;
    });

    it('should unsubscribe commands when the object is destroyed', function() {
      this.service.destroy();
      Radio.channel('bar').command('foo');
      expect(this.clickStub2).to.have.been.calledOnce;
    });

    it('should unsubscribe requests when the object is destroyed', function() {
      this.service.destroy();
      Radio.channel('foo').request('bar');
      expect(this.clickStub3).to.have.been.calledOnce;
    });

    it('shouldn\'t overunsubscribe events when the object is destroyed', function() {
      this.service2 = new this.Service();
      this.service.destroy();
      Radio.channel('foo').trigger('bar');
      expect(this.clickStub1).to.have.been.calledTwice;
    });

    it('shouldn\'t overunsubscribe commands when the object is destroyed', function() {
      this.service2 = new this.Service();
      this.service.destroy();
      Radio.channel('bar').command('foo');
      expect(this.clickStub2).to.have.been.calledTwice;
    });

    it('shouldn\'t overunsubscribe requests when the object is destroyed', function() {
      this.service2 = new this.Service();
      this.service.destroy();
      Radio.channel('foo').request('bar');
      expect(this.clickStub3).to.have.been.calledTwice;
    });

  });

});
