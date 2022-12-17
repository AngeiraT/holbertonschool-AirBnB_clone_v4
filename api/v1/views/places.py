#!/usr/bin/python3
""" Places view """

from flask import jsonify, abort, request, make_response
from api.v1.views import app_views
from models.place import Place
from models.city import City
from models.user import User
from models import storage


@app_views.route('/cities/<city_id>/places', methods=['GET'],
                 strict_slashes=False)
def place_objs(city_id=None):
    """Return all Place objects in a City"""
    city = storage.get("City", city_id)
    if city is None:
        abort(404)
    places = []
    for place in city.places:
        places.append(place.to_dict())
    return jsonify(places)


@app_views.route('/places/<place_id>', methods=['GET'], strict_slashes=False)
def place_by_id(place_id=None):
    """Retrieves a place by its id"""
    place = storage.get("Place", place_id)
    if place is None:
        abort(404)
    return jsonify(place.to_dict())


@app_views.route('/places/<place_id>', methods=['DELETE'],
                 strict_slashes=False)
def delete_place(place_id=None):
    """Deletes a Place object"""
    place = storage.get("Place", place_id)
    if place is None:
        abort(404)
    place.delete()
    storage.save()
    return (jsonify({}))


@app_views.route('/cities/<city_id>/places', methods=['POST'],
                 strict_slashes=False)
def place_post(city_id=None):
    """Create Place object"""
    if not request.get_json():
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    if 'user_id' not in request.get_json():
        return make_response(jsonify({'error': 'Missing user_id'}), 400)
    if 'name' not in request.get_json():
        return make_response(jsonify({'error': 'Missing name'}), 400)
    dict_body = request.get_json()
    city_objs = storage.get(City, city_id)
    user_info = storage.get(User, dict_body['user_id'])

    if city_objs is None:
        abort(404)
    if user_info is None:
        abort(404)
    if city_objs and user_info:
        new_place = Place(**dict_body)
        new_place.city_id = city_objs.id
        storage.new(new_place)
        storage.save()
        return make_response(jsonify(new_place.to_dict()), 201)


@app_views.route('/places/<place_id>', methods=['PUT'],
                 strict_slashes=False)
def place_put(place_id=None):
    """Update Place object"""
    if not request.get_json():
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    dict_body = request.get_json()
    place_obj = storage.get(Place, place_id)
    if place_obj is None:
        abort(404)
    if place_obj:
        for key, value in dict_body.items():
            if key != "id" and key != "created_at" and key != "updated_at"\
               and key != "user_id" and key != "city_id":
                setattr(place_obj, key, value)
        storage.save()
        return make_response(jsonify(place_obj.to_dict()), 200)


@app_views.route("/places_search", methods=["POST"], strict_slashes=False)
def searchPlace():
    """ retrieves all Place objects depending of the JSON in the body of the
    request."""
    search = request.get_json()
    if search is None:
        return jsonify({"error": "Not a JSON"}), 400

    answer = set()

    if "states" in search:
        stid = [storage.get("State", stateid) for stateid in search["states"]]
        states = [st for st in stid if st is not None]
        for state in states:
            for city in state.cities:
                answer.update(set(city.places))

    if "cities" in search:
        cityid = [storage.get("City", cid) for cid in search["cities"]]
        cities = [cty for cty in cityid if cty is not None]
        for city in cities:
            for place in city.places:
                if place not in answer:
                    answer.add(place)

    if len(answer) == 0:
        answer = storage.all("Place").values()

    if "amenities" in search:
        amenities = [storage.get("Amenity", amenid) for amenid in
                     search["amenities"]]
        alist = [a for a in search if
                 all(amen in a.amenities for amen in amenities)]
    else:
        alist = list(answer)

    dict_plist = [pl.to_dict() for pl in alist]
    for adict in dict_plist:
        if "amenities" in adict:
            del adict["amenities"]

    return jsonify(dict_plist)
